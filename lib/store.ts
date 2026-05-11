'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string; name: string; price: number; quantity: number;
  restaurantId: string; restaurantName: string;
}

type FulfillmentMode = 'delivery' | 'pickup' | 'community_courier'

interface CartStore {
  items: CartItem[]
  fulfillmentMode: FulfillmentMode
  neighborOrders: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  setFulfillmentMode: (mode: FulfillmentMode) => void
  setNeighborOrders: (count: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getDiscountPercent: () => number
  getDiscount: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      fulfillmentMode: 'delivery',
      neighborOrders: 0,
      addItem: (item) => set((state) => {
        const existing = state.items.find(i => i.id === item.id)
        if (existing) {
          return { items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) }
        }
        return { items: [...state.items, { ...item, quantity: 1 }] }
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      updateQuantity: (id, qty) => set((state) => ({
        items: qty <= 0 ? state.items.filter(i => i.id !== id) : state.items.map(i => i.id === id ? { ...i, quantity: qty } : i)
      })),
      setFulfillmentMode: (mode) => set({ fulfillmentMode: mode, neighborOrders: 0 }),
      setNeighborOrders: (count) => set({ neighborOrders: count }),
      clearCart: () => set({ items: [], neighborOrders: 0, fulfillmentMode: 'delivery' }),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getDiscountPercent: () => {
        const { fulfillmentMode, neighborOrders } = get()
        if (fulfillmentMode === 'pickup') return 10
        if (fulfillmentMode === 'community_courier') return neighborOrders === 2 ? 30 : neighborOrders === 1 ? 20 : 10
        return 0
      },
      getDiscount: () => {
        const subtotal = get().getSubtotal()
        return subtotal * (get().getDiscountPercent() / 100)
      },
      getTotal: () => get().getSubtotal() - get().getDiscount(),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'communieats-cart' }
  )
)
