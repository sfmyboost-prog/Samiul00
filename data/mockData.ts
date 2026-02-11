
import { Product, Category, Order, Customer, DashboardStats } from '../types';

export const CATEGORIES: Category[] = [
  { 
    id: '1', name: 'Professional Cinema', slug: 'pro-cinema', icon: '🎥', status: 'active', is_popular: true,
    thumbnail: 'https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?q=80&w=400',
    subcategories: ['8K Cinema', 'Hollywood Grade', 'Heavy Lift', 'Production Ready']
  },
  { 
    id: '2', name: 'FPV Racing & Freestyle', slug: 'fpv-racing', icon: '⚡', status: 'active', is_popular: true,
    thumbnail: 'https://images.unsplash.com/photo-1533560235473-19e31f711f14?q=80&w=400',
    subcategories: ['Digital FPV', '6S Racers', 'Cinewhoops', 'Long Range FPV']
  },
  { 
    id: '3', name: 'Consumer Photography', slug: 'consumer-drones', icon: '📸', status: 'active', is_popular: true,
    thumbnail: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?q=80&w=400',
    subcategories: ['Travel Drones', 'Beginner Friendly', '4K Folding', 'Mini Series']
  },
  { 
    id: '4', name: 'Industrial & Agriculture', slug: 'industrial-drones', icon: '🏗️', status: 'active', is_popular: false,
    thumbnail: 'https://images.unsplash.com/photo-1527142879024-c6c91aa6423c?q=80&w=400',
    subcategories: ['Thermal Mapping', 'Agri-Sprayer', 'Surveying', 'Search & Rescue']
  }
];

const generateDroneInventory = (count: number): Product[] => {
  const products: Product[] = [];
  
  const droneTypes = [
    "Mini Pocket Drone", "Extreme Battery Life Drone", "High-Speed Racing Drone", 
    "Ultra-Light Foldable Travel Drone", "Stealth Silent Flight Drone", 
    "Compact Urban Exploration Drone", "Luxury Premium Design Drone", 
    "Long-Range GPS Survey Drone", "Weather-Resistant Industrial Drone", 
    "AI-Powered Smart Tracking Drone", "Stabilized Gimbal Camera Drone", 
    "Autonomous Mapping Drone", "Professional 8K Camera Drone", 
    "Cinematic Aerial Photography Drone", "Night Vision Surveillance Drone"
  ];

  const featuresList = [
    "low-latency FPV mode", "silent propeller technology", "long endurance battery", 
    "precision GPS lock", "foldable portable design", "intelligent return-to-home", 
    "smart subject tracking", "cinematic stabilization", "real-time HD transmission", 
    "carbon fiber body", "brushless motors", "professional-grade camera module", 
    "ultra-stable hovering", "AI obstacle avoidance", "wind-resistant flight system"
  ];

  // Mapping types to category IDs for logical organization
  const typeToCatMap: Record<string, string> = {
    "Mini Pocket Drone": "3",
    "Extreme Battery Life Drone": "3",
    "High-Speed Racing Drone": "2",
    "Ultra-Light Foldable Travel Drone": "3",
    "Stealth Silent Flight Drone": "4",
    "Compact Urban Exploration Drone": "3",
    "Luxury Premium Design Drone": "1",
    "Long-Range GPS Survey Drone": "4",
    "Weather-Resistant Industrial Drone": "4",
    "AI-Powered Smart Tracking Drone": "4",
    "Stabilized Gimbal Camera Drone": "3",
    "Autonomous Mapping Drone": "4",
    "Professional 8K Camera Drone": "1",
    "Cinematic Aerial Photography Drone": "1",
    "Night Vision Surveillance Drone": "4"
  };

  for (let i = 1; i <= count; i++) {
    // Generate feature set based on consistent offsets to mimic the variety in the user-provided text file
    const typeIndex = (i - 1) % droneTypes.length;
    const typeName = droneTypes[typeIndex];
    
    // Deterministic selection of 3 unique features per product
    const f1 = (i * 3) % featuresList.length;
    const f2 = (i * 7) % featuresList.length;
    const f3 = (i * 11) % featuresList.length;
    
    const selectedFeatures = [
      featuresList[f1], 
      featuresList[f2 === f1 ? (f2 + 1) % featuresList.length : f2], 
      featuresList[f3 === f1 || f3 === f2 ? (f3 + 2) % featuresList.length : f3]
    ];
    
    const title = `${typeName} X-${1000 + i} Series`;
    const description = `${typeName} featuring ${selectedFeatures[0]}, ${selectedFeatures[1]}, and ${selectedFeatures[2]}. This state-of-the-art aircraft is engineered for high-precision operations and maximum durability. Designed for professionals and enthusiasts alike, the X-${1000 + i} provides the ultimate flight experience with integrated smart safety systems and advanced telemetry.`;
    
    const catId = typeToCatMap[typeName] || '3';
    const category = CATEGORIES.find(c => c.id === catId)?.name || 'Consumer Photography';

    // Pricing: Base > $100 ($130 to $480 range) + $50 markup as per instructions
    const basePriceUSD = 130 + ((i * 17) % 350); 
    const finalPriceUSD = basePriceUSD + 50; 
    const finalPriceBDT = Math.round(finalPriceUSD * 120); // Conversion to BDT

    const discount = 5 + (i % 20); // Natural discounts between 5% and 25%

    products.push({
      id: `drone-inv-1000-${i}`,
      name: title,
      category: category,
      category_id: catId,
      subcategory: typeName,
      price: finalPriceBDT,
      originalPrice: Math.round(finalPriceBDT * (1 + (discount / 100))),
      discount: discount,
      // Unique high-quality drone images using specific seeds
      image: `https://picsum.photos/seed/drone-main-${i}/800/600`,
      images: [
        `https://picsum.photos/seed/drone-angle1-${i}/800/600`,
        `https://picsum.photos/seed/drone-angle2-${i}/800/600`,
        `https://picsum.photos/seed/drone-angle3-${i}/800/600`
      ],
      description: description,
      stock: 5 + (i % 95),
      rating: 4.1 + (Math.random() * 0.9),
      reviews: 8 + (i % 1200),
      status: 'active',
      coinReward: Math.round(finalPriceBDT * 0.01),
      maxCoinDeduction: Math.round(finalPriceBDT * 0.05)
    });
  }

  return products;
};

// Replace all existing products with the generated 1,000 unique drone products
export const PRODUCTS: Product[] = generateDroneInventory(1000);

export const ORDERS: Order[] = [
  { 
    id: 'ORD-8821', 
    customerName: 'Md Samiul', 
    customerEmail: 'md4518199@gmail.com', 
    customerPhone: '01711111111', 
    address: 'Banani, Dhaka', 
    total: 35000.00, 
    status: 'Paid', 
    date: '2023-12-01', 
    items: [
        { ...PRODUCTS[0], quantity: 1 }
    ] 
  }
];

export const CUSTOMERS: Customer[] = [
  { 
    id: 'c1', 
    name: 'Md Samiul', 
    email: 'md4518199@gmail.com', 
    phone: '01711111111', 
    password: 'password123', 
    ordersCount: 1, 
    dateJoined: '2023-01-15', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100', 
    status: 'active', 
    coins: 4500 
  }
];

export const DASHBOARD_STATS: DashboardStats = {
  totalEarnings: 12450000.00,
  totalOrders: 1842,
  totalCustomers: 450,
  balance: 8200000.00,
  earningTrend: [180, 210, 195, 380, 350, 520, 490]
};
