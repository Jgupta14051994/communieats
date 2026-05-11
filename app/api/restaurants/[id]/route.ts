import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { RESTAURANTS, MENU_ITEMS } from '@/lib/mock-data'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = createServiceClient()
    const [{ data: r, error: rErr }, { data: menu }] = await Promise.all([
      supabase
        .from('restaurants')
        .select('*, restaurant_order_counts(count, pending_community_courier_count)')
        .eq('id', id)
        .single(),
      supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', id)
        .eq('is_available', true),
    ])

    if (rErr || !r) {
      // Fallback: try matching by mock ID position
      const mockIndex = parseInt(id) - 1
      const mock = RESTAURANTS[mockIndex] || RESTAURANTS.find(x => x.id === id) || RESTAURANTS[0]
      return NextResponse.json({
        restaurant: mock,
        menu: MENU_ITEMS.filter(m => m.restaurantId === mock.id),
      })
    }

    // Map DB restaurant to app shape
    const restaurant = {
      id: r.id,
      name: r.name,
      cuisine: r.cuisine_type,
      rating: Number(r.rating),
      deliveryTime: r.avg_delivery_time,
      distance: '0.8 mi',
      orderCount: r.restaurant_order_counts?.[0]?.count ?? 0,
      pendingCourierOrders: r.restaurant_order_counts?.[0]?.pending_community_courier_count ?? 0,
      image: r.image_url,
      address: r.address,
      lat: Number(r.lat),
      lng: Number(r.lng),
      isOpen: r.is_open,
    }

    // If DB has menu items use them, otherwise generate mock menu for this restaurant
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mappedMenu = (menu || []).map((m: any) => ({
      id: m.id,
      restaurantId: m.restaurant_id,
      name: m.name,
      description: m.description,
      price: Number(m.price),
      image: m.image_url,
      category: m.category,
      isPopular: m.is_popular,
    }))

    // If no menu in DB, create generic menu items
    if (mappedMenu.length === 0) {
      const genericMenus: Record<string, any[]> = {
        Thai: [
          { id: `${id}-1`, restaurantId: id, name: 'Pad Thai', description: 'Rice noodles with shrimp, egg, bean sprouts, peanuts', price: 14.99, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80', category: 'Mains', isPopular: true },
          { id: `${id}-2`, restaurantId: id, name: 'Green Curry', description: 'Coconut milk, green chili, bamboo shoots, Thai basil', price: 15.99, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&q=80', category: 'Mains', isPopular: true },
          { id: `${id}-3`, restaurantId: id, name: 'Spring Rolls (4)', description: 'Crispy vegetable spring rolls with sweet chili sauce', price: 7.99, image: 'https://images.unsplash.com/photo-1548611716-f7ef2bff59b5?w=400&q=80', category: 'Appetizers', isPopular: false },
          { id: `${id}-4`, restaurantId: id, name: 'Mango Sticky Rice', description: 'Sweet sticky rice with fresh mango and coconut cream', price: 6.99, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', category: 'Desserts', isPopular: false },
          { id: `${id}-5`, restaurantId: id, name: 'Thai Iced Tea', description: 'Strong black tea with condensed milk over ice', price: 4.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category: 'Drinks', isPopular: false },
        ],
        Indian: [
          { id: `${id}-1`, restaurantId: id, name: 'Butter Chicken', description: 'Tender chicken in rich tomato-cream sauce', price: 16.99, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80', category: 'Mains', isPopular: true },
          { id: `${id}-2`, restaurantId: id, name: 'Lamb Biryani', description: 'Fragrant basmati rice with slow-cooked lamb and spices', price: 18.99, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', category: 'Mains', isPopular: true },
          { id: `${id}-3`, restaurantId: id, name: 'Samosas (3)', description: 'Crispy pastry filled with spiced potatoes and peas', price: 6.99, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', category: 'Appetizers', isPopular: false },
          { id: `${id}-4`, restaurantId: id, name: 'Gulab Jamun', description: 'Soft milk dumplings in rose-flavored sugar syrup', price: 5.99, image: 'https://images.unsplash.com/photo-1666491590895-5cf700a6a85d?w=400&q=80', category: 'Desserts', isPopular: false },
          { id: `${id}-5`, restaurantId: id, name: 'Mango Lassi', description: 'Chilled yogurt drink with sweet Alphonso mango', price: 4.99, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80', category: 'Drinks', isPopular: false },
        ],
      }

      const cuisine = restaurant.cuisine
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const generic: any[] = genericMenus[cuisine] || [
        { id: `${id}-1`, restaurantId: id, name: `${restaurant.name} Special`, description: "Our chef's signature dish", price: 15.99, image: restaurant.image, category: 'Mains', isPopular: true },
        { id: `${id}-2`, restaurantId: id, name: 'House Salad', description: 'Fresh seasonal greens with house dressing', price: 8.99, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', category: 'Appetizers', isPopular: false },
        { id: `${id}-3`, restaurantId: id, name: 'Daily Soup', description: "Ask your server for today's selection", price: 6.99, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', category: 'Appetizers', isPopular: false },
        { id: `${id}-4`, restaurantId: id, name: 'Seasonal Dessert', description: "Chef's rotating dessert selection", price: 7.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', category: 'Desserts', isPopular: false },
        { id: `${id}-5`, restaurantId: id, name: 'Sparkling Water', description: 'San Pellegrino 750ml', price: 3.99, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', category: 'Drinks', isPopular: false },
      ]
      mappedMenu = generic
    }

    return NextResponse.json({ restaurant, menu: mappedMenu })
  } catch (e) {
    console.error('Restaurant fetch error:', e)
    const mock = RESTAURANTS[0]
    return NextResponse.json({ restaurant: mock, menu: MENU_ITEMS.filter(m => m.restaurantId === mock.id) })
  }
}
