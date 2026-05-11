import { NextResponse } from 'next/server'
import { RESTAURANTS, MENU_ITEMS } from '@/lib/mock-data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GENERIC_MENUS: Record<string, any[]> = {
  Thai: [
    { name: 'Pad Thai', description: 'Rice noodles with shrimp, egg, bean sprouts, peanuts', price: 14.99, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Green Curry', description: 'Coconut milk, green chili, bamboo shoots, Thai basil', price: 15.99, image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Spring Rolls (4)', description: 'Crispy vegetable spring rolls with sweet chili sauce', price: 7.99, image: 'https://images.unsplash.com/photo-1548611716-f7ef2bff59b5?w=400&q=80', category: 'Appetizers', isPopular: false },
    { name: 'Mango Sticky Rice', description: 'Sweet sticky rice with fresh mango and coconut cream', price: 6.99, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', category: 'Desserts', isPopular: false },
    { name: 'Thai Iced Tea', description: 'Strong black tea with condensed milk over ice', price: 4.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category: 'Drinks', isPopular: false },
  ],
  Indian: [
    { name: 'Butter Chicken', description: 'Tender chicken in rich tomato-cream sauce', price: 16.99, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Lamb Biryani', description: 'Fragrant basmati rice with slow-cooked lamb and spices', price: 18.99, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Samosas (3)', description: 'Crispy pastry filled with spiced potatoes and peas', price: 6.99, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80', category: 'Appetizers', isPopular: false },
    { name: 'Gulab Jamun', description: 'Soft milk dumplings in rose-flavored sugar syrup', price: 5.99, image: 'https://images.unsplash.com/photo-1666491590895-5cf700a6a85d?w=400&q=80', category: 'Desserts', isPopular: false },
    { name: 'Mango Lassi', description: 'Chilled yogurt drink with sweet Alphonso mango', price: 4.99, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80', category: 'Drinks', isPopular: false },
  ],
  Chinese: [
    { name: 'Kung Pao Chicken', description: 'Spicy stir-fry with peanuts, chili, and vegetables', price: 14.99, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Dim Sum Basket', description: 'Assorted steamed dumplings (6 pieces)', price: 12.99, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Egg Rolls (4)', description: 'Crispy fried rolls with pork and vegetables', price: 6.99, image: 'https://images.unsplash.com/photo-1548611716-f7ef2bff59b5?w=400&q=80', category: 'Appetizers', isPopular: false },
    { name: 'Mango Pudding', description: 'Silky smooth mango dessert', price: 5.99, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', category: 'Desserts', isPopular: false },
    { name: 'Jasmine Tea', description: 'Fragrant Chinese jasmine tea', price: 2.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category: 'Drinks', isPopular: false },
  ],
  Mediterranean: [
    { name: 'Mixed Grill Platter', description: 'Lamb kofta, chicken shish, and grilled vegetables', price: 22.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Falafel Wrap', description: 'Crispy falafel, hummus, tahini, pickled vegetables', price: 12.99, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Hummus & Pita', description: 'Creamy hummus with warm pita bread and olive oil', price: 8.99, image: 'https://images.unsplash.com/photo-1527756704424-8c5aabcf0259?w=400&q=80', category: 'Appetizers', isPopular: false },
    { name: 'Baklava', description: 'Honey-soaked phyllo pastry with pistachios', price: 6.99, image: 'https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?w=400&q=80', category: 'Desserts', isPopular: false },
    { name: 'Mint Lemonade', description: 'Fresh-squeezed lemonade with mint', price: 4.99, image: 'https://images.unsplash.com/photo-1523371683773-affcb1958bb4?w=400&q=80', category: 'Drinks', isPopular: false },
  ],
  Vietnamese: [
    { name: 'Pho Bo', description: 'Slow-cooked beef bone broth with rice noodles and herbs', price: 14.99, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Banh Mi', description: 'Crusty baguette with grilled pork, pickled daikon, jalapeño', price: 10.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Fresh Spring Rolls', description: 'Rice paper rolls with shrimp, herbs, and peanut sauce', price: 8.99, image: 'https://images.unsplash.com/photo-1548611716-f7ef2bff59b5?w=400&q=80', category: 'Appetizers', isPopular: false },
    { name: 'Che Ba Mau', description: 'Three-color dessert with beans and coconut milk', price: 5.99, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80', category: 'Desserts', isPopular: false },
    { name: 'Vietnamese Iced Coffee', description: 'Strong drip coffee with sweetened condensed milk', price: 4.99, image: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=400&q=80', category: 'Drinks', isPopular: false },
  ],
  Greek: [
    { name: 'Moussaka', description: 'Layered eggplant, ground lamb, and béchamel sauce', price: 17.99, image: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Souvlaki Plate', description: 'Grilled pork skewers with pita, tzatziki, and salad', price: 16.99, image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Spanakopita', description: 'Crispy phyllo pastry filled with spinach and feta', price: 8.99, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80', category: 'Appetizers', isPopular: false },
    { name: 'Loukoumades', description: 'Greek honey donuts with cinnamon', price: 7.99, image: 'https://images.unsplash.com/photo-1624471066025-5da4c1a0c3db?w=400&q=80', category: 'Desserts', isPopular: false },
    { name: 'Greek Frappé', description: 'Chilled instant coffee shaken with milk and ice', price: 4.99, image: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4?w=400&q=80', category: 'Drinks', isPopular: false },
  ],
  French: [
    { name: 'Steak Frites', description: 'Pan-seared hanger steak with crispy frites and béarnaise', price: 28.99, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'Coq au Vin', description: 'Braised chicken thighs in red wine, mushrooms, and lardons', price: 24.99, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', category: 'Mains', isPopular: true },
    { name: 'French Onion Soup', description: 'Slow-cooked onion broth with gruyère crouton', price: 11.99, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', category: 'Appetizers', isPopular: false },
    { name: 'Crème Brûlée', description: 'Classic vanilla custard with caramelized sugar crust', price: 9.99, image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80', category: 'Desserts', isPopular: false },
    { name: 'Kir Royale', description: 'Champagne with blackcurrant liqueur', price: 12.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category: 'Drinks', isPopular: false },
  ],
}

function makeGenericMenu(restaurantId: string, cuisine: string, image: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const template: any[] = GENERIC_MENUS[cuisine] || [
    { name: 'House Special', description: "Chef's signature dish of the day", price: 15.99, image, category: 'Mains', isPopular: true },
    { name: 'Seasonal Soup', description: "Today's fresh-made soup", price: 7.99, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', category: 'Appetizers', isPopular: false },
    { name: 'Garden Salad', description: 'Fresh seasonal greens with house dressing', price: 9.99, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', category: 'Appetizers', isPopular: false },
    { name: "Chef's Dessert", description: "Ask your server for today's selection", price: 8.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', category: 'Desserts', isPopular: false },
    { name: 'Sparkling Water', description: 'San Pellegrino 750ml', price: 3.99, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', category: 'Drinks', isPopular: false },
  ]
  return template.map((item, i) => ({ ...item, id: `${restaurantId}-${i}`, restaurantId }))
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  try {
    if (!supabaseUrl || !anonKey) throw new Error('No env vars')

    const headers = {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
    }

    const [rRes, mRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/restaurants?id=eq.${id}&select=*,restaurant_order_counts(count,pending_community_courier_count)`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/menu_items?restaurant_id=eq.${id}&is_available=eq.true&select=*`, { headers }),
    ])

    const [rData, mData] = await Promise.all([rRes.json(), mRes.json()])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = Array.isArray(rData) ? rData[0] : null

    if (!r) {
      const mock = RESTAURANTS[0]
      return NextResponse.json({ restaurant: mock, menu: MENU_ITEMS.filter(m => m.restaurantId === mock.id) })
    }

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbMenu = Array.isArray(mData) ? mData.map((m: any) => ({
      id: m.id,
      restaurantId: m.restaurant_id,
      name: m.name,
      description: m.description,
      price: Number(m.price),
      image: m.image_url,
      category: m.category,
      isPopular: m.is_popular,
    })) : []

    const menu = dbMenu.length > 0 ? dbMenu : makeGenericMenu(id, r.cuisine_type, r.image_url)

    return NextResponse.json({ restaurant, menu })
  } catch (e) {
    console.error('[GET /api/restaurants/[id]]', e)
    const mock = RESTAURANTS[0]
    return NextResponse.json({ restaurant: mock, menu: MENU_ITEMS.filter(m => m.restaurantId === mock.id) })
  }
}
