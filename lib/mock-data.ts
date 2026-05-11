export interface Restaurant {
  id: string; name: string; cuisine: string; rating: number;
  deliveryTime: number; distance: string; orderCount: number;
  pendingCourierOrders: number; image: string; address: string;
  lat: number; lng: number; isOpen: boolean;
}

export interface MenuItem {
  id: string; restaurantId: string; name: string; description: string;
  price: number; image: string; category: string; isPopular?: boolean;
}

export interface NeighborOrder {
  id: string; restaurantId: string; boxes: number; distance: string; reward: number;
}

export const RESTAURANTS: Restaurant[] = [
  { id: '1', name: 'Sakura Sushi', cuisine: 'Japanese', rating: 4.8, deliveryTime: 25, distance: '0.8 mi', orderCount: 234, pendingCourierOrders: 5, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80', address: '123 Spring St, NYC', lat: 40.7219, lng: -74.0051, isOpen: true },
  { id: '2', name: 'Napoli Pizza', cuisine: 'Italian', rating: 4.6, deliveryTime: 30, distance: '1.2 mi', orderCount: 189, pendingCourierOrders: 3, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80', address: '456 Prince St, NYC', lat: 40.7257, lng: -73.9970, isOpen: true },
  { id: '3', name: 'Taco Loco', cuisine: 'Mexican', rating: 4.5, deliveryTime: 20, distance: '0.5 mi', orderCount: 312, pendingCourierOrders: 7, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80', address: '789 Houston St, NYC', lat: 40.7285, lng: -74.0020, isOpen: true },
  { id: '4', name: 'Thai Garden', cuisine: 'Thai', rating: 4.7, deliveryTime: 35, distance: '1.5 mi', orderCount: 156, pendingCourierOrders: 4, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=600&q=80', address: '321 Bleecker St, NYC', lat: 40.7308, lng: -74.0041, isOpen: true },
  { id: '5', name: 'Curry House', cuisine: 'Indian', rating: 4.4, deliveryTime: 40, distance: '2.1 mi', orderCount: 98, pendingCourierOrders: 2, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80', address: '654 6th Ave, NYC', lat: 40.7359, lng: -73.9988, isOpen: true },
  { id: '6', name: 'Burger Republic', cuisine: 'American', rating: 4.3, deliveryTime: 22, distance: '0.9 mi', orderCount: 445, pendingCourierOrders: 8, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80', address: '987 7th Ave, NYC', lat: 40.7392, lng: -74.0059, isOpen: true },
  { id: '7', name: 'Dragon Palace', cuisine: 'Chinese', rating: 4.5, deliveryTime: 28, distance: '1.1 mi', orderCount: 267, pendingCourierOrders: 6, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80', address: '147 Canal St, NYC', lat: 40.7183, lng: -74.0007, isOpen: true },
  { id: '8', name: 'Mediterranean Breeze', cuisine: 'Mediterranean', rating: 4.6, deliveryTime: 32, distance: '1.8 mi', orderCount: 134, pendingCourierOrders: 3, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80', address: '258 W 4th St, NYC', lat: 40.7335, lng: -74.0024, isOpen: true },
  { id: '9', name: 'Seoul Kitchen', cuisine: 'Korean', rating: 4.7, deliveryTime: 27, distance: '0.7 mi', orderCount: 389, pendingCourierOrders: 9, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80', address: '369 W 32nd St, NYC', lat: 40.7488, lng: -73.9900, isOpen: true },
  { id: '10', name: 'Pho Saigon', cuisine: 'Vietnamese', rating: 4.5, deliveryTime: 25, distance: '1.3 mi', orderCount: 178, pendingCourierOrders: 4, image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80', address: '741 Mott St, NYC', lat: 40.7197, lng: -73.9967, isOpen: true },
  { id: '11', name: 'The Greek Place', cuisine: 'Greek', rating: 4.4, deliveryTime: 35, distance: '2.4 mi', orderCount: 87, pendingCourierOrders: 2, image: 'https://images.unsplash.com/photo-1544378730-8b5104b18790?w=600&q=80', address: '852 Astoria Blvd, NYC', lat: 40.7721, lng: -73.9302, isOpen: true },
  { id: '12', name: 'Bistro Paris', cuisine: 'French', rating: 4.9, deliveryTime: 45, distance: '3.0 mi', orderCount: 67, pendingCourierOrders: 1, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', address: '963 Park Ave, NYC', lat: 40.7685, lng: -73.9653, isOpen: true },
]

export const MENU_ITEMS: MenuItem[] = [
  // Sakura Sushi
  { id: 'm1', restaurantId: '1', name: 'Salmon Nigiri', description: 'Fresh Atlantic salmon over seasoned rice', price: 8.99, image: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80', category: 'Mains', isPopular: true },
  { id: 'm2', restaurantId: '1', name: 'Dragon Roll', description: 'Shrimp tempura, avocado, cucumber topped with tuna', price: 16.99, image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=80', category: 'Mains', isPopular: true },
  { id: 'm3', restaurantId: '1', name: 'Miso Soup', description: 'Traditional Japanese soup with tofu and seaweed', price: 3.99, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', category: 'Appetizers' },
  { id: 'm4', restaurantId: '1', name: 'Edamame', description: 'Steamed soybeans with sea salt', price: 4.99, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', category: 'Appetizers' },
  { id: 'm5', restaurantId: '1', name: 'Green Tea Ice Cream', description: 'Matcha flavored ice cream', price: 5.99, image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&q=80', category: 'Desserts' },
  { id: 'm6', restaurantId: '1', name: 'Sake', description: 'Premium Japanese rice wine', price: 9.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category: 'Drinks' },
  // Napoli Pizza
  { id: 'm7', restaurantId: '2', name: 'Margherita Pizza', description: 'San Marzano tomato, fresh mozzarella, basil', price: 18.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', category: 'Mains', isPopular: true },
  { id: 'm8', restaurantId: '2', name: 'Pepperoni Pizza', description: 'Classic pepperoni with house tomato sauce', price: 20.99, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80', category: 'Mains', isPopular: true },
  { id: 'm9', restaurantId: '2', name: 'Bruschetta', description: 'Grilled bread with tomatoes and garlic', price: 7.99, image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80', category: 'Appetizers' },
  { id: 'm10', restaurantId: '2', name: 'Tiramisu', description: 'Classic Italian dessert with espresso', price: 8.99, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', category: 'Desserts' },
  { id: 'm11', restaurantId: '2', name: 'Sparkling Water', description: 'San Pellegrino 750ml', price: 4.99, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', category: 'Drinks' },
  // Taco Loco
  { id: 'm12', restaurantId: '3', name: 'Street Tacos (3)', description: 'Carnitas, onion, cilantro, salsa verde', price: 12.99, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80', category: 'Mains', isPopular: true },
  { id: 'm13', restaurantId: '3', name: 'Burrito Bowl', description: 'Rice, beans, chicken, guac, pico de gallo', price: 13.99, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80', category: 'Mains', isPopular: true },
  { id: 'm14', restaurantId: '3', name: 'Guacamole & Chips', description: 'Fresh avocado, lime, jalapeño', price: 8.99, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&q=80', category: 'Appetizers' },
  { id: 'm15', restaurantId: '3', name: 'Churros', description: 'With chocolate dipping sauce', price: 6.99, image: 'https://images.unsplash.com/photo-1624471066025-5da4c1a0c3db?w=400&q=80', category: 'Desserts' },
  { id: 'm16', restaurantId: '3', name: 'Horchata', description: 'Sweet rice milk with cinnamon', price: 3.99, image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80', category: 'Drinks' },
  // Burger Republic
  { id: 'm17', restaurantId: '6', name: 'Classic Smash Burger', description: 'Double patty, American cheese, pickles, special sauce', price: 14.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', category: 'Mains', isPopular: true },
  { id: 'm18', restaurantId: '6', name: 'Truffle Fries', description: 'Hand-cut fries with truffle oil and parmesan', price: 7.99, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80', category: 'Appetizers', isPopular: true },
  { id: 'm19', restaurantId: '6', name: 'Chicken Sandwich', description: 'Crispy fried chicken, pickles, hot honey', price: 13.99, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80', category: 'Mains' },
  { id: 'm20', restaurantId: '6', name: 'Vanilla Shake', description: 'Thick hand-spun milkshake', price: 6.99, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80', category: 'Drinks' },
  { id: 'm21', restaurantId: '6', name: 'Brownie Sundae', description: 'Warm brownie with vanilla ice cream', price: 8.99, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', category: 'Desserts' },
  // Seoul Kitchen
  { id: 'm22', restaurantId: '9', name: 'Bibimbap', description: 'Mixed rice bowl with vegetables, egg, gochujang', price: 15.99, image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&q=80', category: 'Mains', isPopular: true },
  { id: 'm23', restaurantId: '9', name: 'Korean Fried Chicken', description: 'Crispy double-fried with sweet soy glaze', price: 17.99, image: 'https://images.unsplash.com/photo-1618135623429-f1b89b1df37a?w=400&q=80', category: 'Mains', isPopular: true },
  { id: 'm24', restaurantId: '9', name: 'Kimchi Pancake', description: 'Crispy savory pancake with fermented kimchi', price: 9.99, image: 'https://images.unsplash.com/photo-1583224994559-c5766b2c75df?w=400&q=80', category: 'Appetizers' },
  { id: 'm25', restaurantId: '9', name: 'Soju', description: 'Korean rice spirit, classic flavor', price: 7.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', category: 'Drinks' },
  { id: 'm26', restaurantId: '9', name: 'Bingsu', description: 'Shaved ice dessert with red bean and mochi', price: 8.99, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80', category: 'Desserts' },
]

export const NEIGHBOR_ORDERS: NeighborOrder[] = [
  { id: 'n1', restaurantId: '1', boxes: 2, distance: '0.8 mi', reward: 2.50 },
  { id: 'n2', restaurantId: '1', boxes: 1, distance: '1.1 mi', reward: 2.00 },
  { id: 'n3', restaurantId: '1', boxes: 3, distance: '0.5 mi', reward: 3.00 },
  { id: 'n4', restaurantId: '2', boxes: 2, distance: '0.9 mi', reward: 2.50 },
  { id: 'n5', restaurantId: '2', boxes: 1, distance: '1.3 mi', reward: 2.00 },
  { id: 'n6', restaurantId: '3', boxes: 4, distance: '0.7 mi', reward: 3.50 },
  { id: 'n7', restaurantId: '3', boxes: 2, distance: '1.0 mi', reward: 2.50 },
  { id: 'n8', restaurantId: '6', boxes: 3, distance: '0.6 mi', reward: 3.00 },
  { id: 'n9', restaurantId: '6', boxes: 2, distance: '1.4 mi', reward: 2.50 },
  { id: 'n10', restaurantId: '9', boxes: 1, distance: '0.4 mi', reward: 2.00 },
  { id: 'n11', restaurantId: '9', boxes: 3, distance: '0.9 mi', reward: 3.00 },
]

export const MOCK_USER = {
  name: 'Alex Chen',
  email: 'test@communieats.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  community_points: 1250,
  total_co2_saved: 8.4,
  deliveries_completed: 23,
  discount_earned: 47.50,
  tier: 'Community Hero',
  rank: 12,
}

export const LEADERBOARD = [
  { rank: 1, name: 'Maria S.', deliveries: 89, co2: 32.1, points: 4450 },
  { rank: 2, name: 'James T.', deliveries: 67, co2: 24.2, points: 3350 },
  { rank: 3, name: 'Priya K.', deliveries: 54, co2: 19.4, points: 2700 },
  { rank: 4, name: 'Carlos M.', deliveries: 41, co2: 14.8, points: 2050 },
  { rank: 5, name: 'Zoe L.', deliveries: 35, co2: 12.6, points: 1750 },
]

export const MOCK_ORDERS = [
  { id: 'ord1', restaurantName: 'Sakura Sushi', restaurantImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80', items: ['Dragon Roll', 'Miso Soup'], total: 18.98, fulfillmentMode: 'community_courier', status: 'delivered', date: '2024-01-15', co2Saved: 0.4, neighborDeliveries: 2 },
  { id: 'ord2', restaurantName: 'Burger Republic', restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', items: ['Classic Smash Burger', 'Truffle Fries'], total: 19.48, fulfillmentMode: 'pickup', status: 'delivered', date: '2024-01-12', co2Saved: 0.2, neighborDeliveries: 0 },
  { id: 'ord3', restaurantName: 'Taco Loco', restaurantImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80', items: ['Street Tacos (3)', 'Guacamole & Chips', 'Horchata'], total: 23.97, fulfillmentMode: 'community_courier', status: 'delivered', date: '2024-01-10', co2Saved: 0.6, neighborDeliveries: 1 },
]
