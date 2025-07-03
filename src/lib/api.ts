import { Product, Category, Order, User, Address, PaymentMethod, Notification } from '@/types';

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 13 Pro Max',
    description: 'The latest iPhone with A15 Bionic chip, Pro camera system, and Super Retina XDR display with ProMotion.',
    price: 1099.99,
    rating: 4.8,
    reviewCount: 246,
    image: 'https://placehold.co/600x600?text=iPhone+13',
    images: [
      'https://placehold.co/600x600?text=iPhone+13+Front',
      'https://placehold.co/600x600?text=iPhone+13+Back',
      'https://placehold.co/600x600?text=iPhone+13+Side',
    ],
    categoryId: 'electronics',
    stock: 50,
    freeShipping: true,
    variants: [
      { id: '1-1', name: 'Sierra Blue', price: 1099.99 },
      { id: '1-2', name: 'Silver', price: 1099.99 },
      { id: '1-3', name: 'Gold', price: 1099.99 },
      { id: '1-4', name: 'Graphite', price: 1099.99 },
    ],
    specifications: {
      display: '6.7-inch Super Retina XDR display with ProMotion',
      chip: 'A15 Bionic chip',
      camera: 'Pro 12MP camera system: Telephoto, Wide, and Ultra Wide',
      battery: 'Up to 28 hours video playback',
      storage: '128GB, 256GB, 512GB, 1TB',
    },
  },
  {
    id: '2',
    name: 'Samsung Galaxy S22 Ultra',
    description: 'The most advanced Galaxy smartphone with built-in S Pen, Nightography camera, and powerful 4nm processor.',
    price: 1199.99,
    originalPrice: 1299.99,
    rating: 4.7,
    reviewCount: 189,
    image: 'https://placehold.co/600x600?text=Galaxy+S22',
    images: [
      'https://placehold.co/600x600?text=Galaxy+S22+Front',
      'https://placehold.co/600x600?text=Galaxy+S22+Back',
      'https://placehold.co/600x600?text=Galaxy+S22+Side',
    ],
    categoryId: 'electronics',
    stock: 35,
    freeShipping: true,
    variants: [
      { id: '2-1', name: 'Phantom Black', price: 1199.99 },
      { id: '2-2', name: 'Phantom White', price: 1199.99 },
      { id: '2-3', name: 'Burgundy', price: 1199.99 },
      { id: '2-4', name: 'Green', price: 1199.99 },
    ],
    specifications: {
      display: '6.8-inch Dynamic AMOLED 2X display',
      chip: '4nm processor',
      camera: '108MP + 12MP + 10MP + 10MP quad rear camera',
      battery: '5,000mAh',
      storage: '128GB, 256GB, 512GB, 1TB',
    },
  },
  {
    id: '3',
    name: 'MacBook Pro 16-inch',
    description: 'Supercharged for pros. The most powerful MacBook Pro ever with M1 Pro or M1 Max chip for groundbreaking performance.',
    price: 2499.99,
    rating: 4.9,
    reviewCount: 156,
    image: 'https://placehold.co/600x600?text=MacBook+Pro',
    images: [
      'https://placehold.co/600x600?text=MacBook+Pro+Front',
      'https://placehold.co/600x600?text=MacBook+Pro+Open',
      'https://placehold.co/600x600?text=MacBook+Pro+Side',
    ],
    categoryId: 'electronics',
    stock: 20,
    freeShipping: true,
    variants: [
      { id: '3-1', name: 'Space Gray', price: 2499.99 },
      { id: '3-2', name: 'Silver', price: 2499.99 },
    ],
    specifications: {
      display: '16-inch Liquid Retina XDR display',
      chip: 'M1 Pro or M1 Max chip',
      memory: 'Up to 64GB unified memory',
      storage: 'Up to 8TB SSD storage',
      battery: 'Up to 21 hours video playback',
    },
  },
  {
    id: '4',
    name: 'Sony WH-1000XM4 Wireless Headphones',
    description: 'Industry leading noise canceling with Dual Noise Sensor technology and exceptional sound quality.',
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviewCount: 532,
    image: 'https://placehold.co/600x600?text=Sony+Headphones',
    images: [
      'https://placehold.co/600x600?text=Sony+Headphones+1',
      'https://placehold.co/600x600?text=Sony+Headphones+2',
      'https://placehold.co/600x600?text=Sony+Headphones+3',
    ],
    categoryId: 'electronics',
    stock: 100,
    freeShipping: true,
    variants: [
      { id: '4-1', name: 'Black', price: 349.99 },
      { id: '4-2', name: 'Silver', price: 349.99 },
      { id: '4-3', name: 'Blue', price: 349.99 },
    ],
    specifications: {
      type: 'Wireless Noise Canceling',
      battery: 'Up to 30 hours',
      connectivity: 'Bluetooth 5.0',
      features: 'Touch controls, Speak-to-chat, Adaptive Sound Control',
    },
  },
  {
    id: '5',
    name: 'Nike Air Max 270',
    description: 'The Nike Air Max 270 delivers visible cushioning under every step with a huge Max Air unit and lightweight foam.',
    price: 150,
    rating: 4.6,
    reviewCount: 324,
    image: 'https://placehold.co/600x600?text=Nike+Air+Max',
    images: [
      'https://placehold.co/600x600?text=Nike+Air+Max+Side',
      'https://placehold.co/600x600?text=Nike+Air+Max+Top',
      'https://placehold.co/600x600?text=Nike+Air+Max+Back',
    ],
    categoryId: 'clothing',
    stock: 75,
    freeShipping: true,
    variants: [
      { id: '5-1', name: 'Black/White', price: 150 },
      { id: '5-2', name: 'White/Red', price: 150 },
      { id: '5-3', name: 'Blue/Gray', price: 150 },
    ],
    specifications: {
      style: 'Athletic shoes',
      material: 'Mesh and synthetic upper',
      cushioning: 'Max Air 270 unit',
      fit: 'True to size',
    },
  },
  {
    id: '6',
    name: 'Instant Pot Duo 7-in-1',
    description: 'The Instant Pot Duo is a 7-in-1 programmable cooker replacing several kitchen appliances with one.',
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.7,
    reviewCount: 945,
    image: 'https://placehold.co/600x600?text=Instant+Pot',
    images: [
      'https://placehold.co/600x600?text=Instant+Pot+Front',
      'https://placehold.co/600x600?text=Instant+Pot+Top',
      'https://placehold.co/600x600?text=Instant+Pot+Controls',
    ],
    categoryId: 'home',
    stock: 120,
    freeShipping: true,
    variants: [
      { id: '6-1', name: '3 Quart', price: 79.99 },
      { id: '6-2', name: '6 Quart', price: 89.99 },
      { id: '6-3', name: '8 Quart', price: 119.99 },
    ],
    specifications: {
      functions: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer',
      capacity: 'Available in 3, 6, or 8 quarts',
      programs: '14 smart programs',
      safety: '10+ built-in safety features',
    },
  },
  {
    id: '7',
    name: 'Neutrogena Hydro Boost Water Gel',
    description: 'This lightweight gel cream instantly quenches and continuously hydrates skin.',
    price: 19.99,
    rating: 4.5,
    reviewCount: 1203,
    image: 'https://placehold.co/600x600?text=Neutrogena+Gel',
    images: [
      'https://placehold.co/600x600?text=Neutrogena+Gel+Front',
      'https://placehold.co/600x600?text=Neutrogena+Gel+Open',
      'https://placehold.co/600x600?text=Neutrogena+Gel+Side',
    ],
    categoryId: 'beauty',
    stock: 200,
    freeShipping: false,
    specifications: {
      type: 'Water-based moisturizer',
      size: '1.7 oz',
      skin_type: 'All skin types',
      ingredients: 'Hyaluronic acid, glycerin',
    },
  },
  {
    id: '8',
    name: 'Dyson V11 Torque Drive',
    description: 'Dyson\'s most intelligent cordless vacuum with twice the suction of any cord-free vacuum.',
    price: 699.99,
    originalPrice: 749.99,
    rating: 4.7,
    reviewCount: 378,
    image: 'https://placehold.co/600x600?text=Dyson+Vacuum',
    images: [
      'https://placehold.co/600x600?text=Dyson+Vacuum+Full',
      'https://placehold.co/600x600?text=Dyson+Vacuum+Head',
      'https://placehold.co/600x600?text=Dyson+Vacuum+Attachments',
    ],
    categoryId: 'home',
    stock: 30,
    freeShipping: true,
    specifications: {
      runtime: 'Up to 60 minutes',
      power_modes: 'Eco, Auto, Boost',
      display: 'LCD screen shows runtime and performance',
      filtration: 'Advanced whole-machine filtration',
    },
  },
];

// Mock data for categories
const mockCategories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Explore the latest tech gadgets and electronics.',
    image: 'https://placehold.co/600x400?text=Electronics',
  },
  {
    id: 'clothing',
    name: 'Clothing & Accessories',
    description: 'Discover trendy fashion and accessories for all seasons.',
    image: 'https://placehold.co/600x400?text=Clothing',
  },
  {
    id: 'home',
    name: 'Home & Kitchen',
    description: 'Everything you need for your home, from appliances to decor.',
    image: 'https://placehold.co/600x400?text=Home',
  },
  {
    id: 'beauty',
    name: 'Beauty & Personal Care',
    description: 'Premium beauty products and personal care essentials.',
    image: 'https://placehold.co/600x400?text=Beauty',
  }
];

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: 'ORD123456',
    userId: 'user1',
    items: [
      {
        productId: '1',
        name: 'iPhone 13 Pro Max',
        image: 'https://placehold.co/600x600?text=iPhone+13',
        price: 1099.99,
        quantity: 1,
        variantId: '1-1',
        variantName: 'Sierra Blue',
      }
    ],
    status: 'delivered',
    createdAt: new Date('2023-06-15').toISOString(),
    updatedAt: new Date('2023-06-20').toISOString(),
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '555-123-4567'
    },
    billingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '555-123-4567'
    },
    paymentMethod: {
      type: 'credit_card',
      cardBrand: 'Visa',
      last4: '4242',
    },
    subtotal: 1099.99,
    tax: 88.00,
    shipping: 0,
    total: 1187.99,
    trackingInfo: {
      carrier: 'FedEx',
      trackingNumber: 'FDX123456789',
      estimatedDelivery: new Date('2023-06-18').toISOString(),
      actualDelivery: new Date('2023-06-17').toISOString(),
      status: 'delivered',
      trackingHistory: [
        {
          status: 'order_placed',
          location: 'Online',
          timestamp: new Date('2023-06-15T10:30:00').toISOString(),
        },
        {
          status: 'processing',
          location: 'Regional Warehouse',
          timestamp: new Date('2023-06-15T14:45:00').toISOString(),
        },
        {
          status: 'shipped',
          location: 'Regional Distribution Center',
          timestamp: new Date('2023-06-16T09:15:00').toISOString(),
        },
        {
          status: 'out_for_delivery',
          location: 'Local Delivery Center',
          timestamp: new Date('2023-06-17T08:30:00').toISOString(),
        },
        {
          status: 'delivered',
          location: 'New York, NY',
          timestamp: new Date('2023-06-17T14:20:00').toISOString(),
        },
      ],
    },
  },
  {
    id: 'ORD789012',
    userId: 'user1',
    items: [
      {
        productId: '3',
        name: 'MacBook Pro 16-inch',
        image: 'https://placehold.co/600x600?text=MacBook+Pro',
        price: 2499.99,
        quantity: 1,
        variantId: '3-1',
        variantName: 'Space Gray',
      },
      {
        productId: '4',
        name: 'Sony WH-1000XM4 Wireless Headphones',
        image: 'https://placehold.co/600x600?text=Sony+Headphones',
        price: 349.99,
        quantity: 1,
        variantId: '4-1',
        variantName: 'Black',
      },
    ],
    status: 'shipped',
    createdAt: new Date('2023-07-10').toISOString(),
    updatedAt: new Date('2023-07-11').toISOString(),
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '555-123-4567'
    },
    billingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '555-123-4567'
    },
    paymentMethod: {
      type: 'credit_card',
      cardBrand: 'Mastercard',
      last4: '5678',
    },
    subtotal: 2849.98,
    tax: 228.00,
    shipping: 0,
    total: 3077.98,
    trackingInfo: {
      carrier: 'UPS',
      trackingNumber: 'UPS987654321',
      estimatedDelivery: new Date('2023-07-14').toISOString(),
      status: 'in_transit',
      trackingHistory: [
        {
          status: 'order_placed',
          location: 'Online',
          timestamp: new Date('2023-07-10T15:20:00').toISOString(),
        },
        {
          status: 'processing',
          location: 'Regional Warehouse',
          timestamp: new Date('2023-07-10T18:30:00').toISOString(),
        },
        {
          status: 'shipped',
          location: 'Regional Distribution Center',
          timestamp: new Date('2023-07-11T10:45:00').toISOString(),
        },
      ],
    },
  },
  {
    id: 'ORD345678',
    userId: 'user1',
    items: [
      {
        productId: '6',
        name: 'Instant Pot Duo 7-in-1',
        image: 'https://placehold.co/600x600?text=Instant+Pot',
        price: 89.99,
        quantity: 1,
        variantId: '6-2',
        variantName: '6 Quart',
      },
    ],
    status: 'processing',
    createdAt: new Date('2023-07-20').toISOString(),
    updatedAt: new Date('2023-07-20').toISOString(),
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '555-123-4567'
    },
    billingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '555-123-4567'
    },
    paymentMethod: {
      type: 'paypal',
      email: 'j***@gmail.com',
    },
    subtotal: 89.99,
    tax: 7.20,
    shipping: 5.99,
    total: 103.18,
    trackingInfo: {
      status: 'processing',
      trackingHistory: [
        {
          status: 'order_placed',
          location: 'Online',
          timestamp: new Date('2023-07-20T09:15:00').toISOString(),
        },
        {
          status: 'processing',
          location: 'Regional Warehouse',
          timestamp: new Date('2023-07-20T11:30:00').toISOString(),
        },
      ],
    },
  },
];

// Mock user data
const mockUser: User = {
  id: 'user1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '555-123-4567',
  addresses: [
    {
      id: 'addr1',
      name: 'John Doe',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '555-123-4567',
      isDefault: true,
      type: 'both',
    },
    {
      id: 'addr2',
      name: 'John Doe',
      street: '456 Work Ave',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      country: 'USA',
      phone: '555-987-6543',
      isDefault: false,
      type: 'shipping',
    },
  ],
  paymentMethods: [
    {
      id: 'pm1',
      type: 'credit_card',
      cardBrand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      billingAddressId: 'addr1',
    },
    {
      id: 'pm2',
      type: 'credit_card',
      cardBrand: 'Mastercard',
      last4: '5678',
      expiryMonth: 6,
      expiryYear: 2026,
      isDefault: false,
      billingAddressId: 'addr1',
    },
    {
      id: 'pm3',
      type: 'paypal',
      email: 'john.doe@gmail.com',
      isDefault: false,
    },
  ],
  favorites: {
    products: ['1', '3', '6'],
    sellers: ['seller1', 'seller3'],
  },
  notifications: {
    email: {
      orders: true,
      promotions: true,
      returns: true,
      productUpdates: false,
    },
    push: {
      orders: true,
      promotions: false,
      returns: true,
      productUpdates: true,
    },
    sms: {
      orders: true,
      promotions: false,
      returns: false,
      productUpdates: false,
    },
  },
};

// Mock notification preferences
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Your order has been delivered',
    message: 'Order #ORD123456 has been delivered. Thank you for shopping with us!',
    type: 'order',
    read: true,
    createdAt: new Date('2023-06-17T14:25:00').toISOString(),
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Your order has shipped',
    message: 'Order #ORD789012 has been shipped. Track your package with UPS tracking number UPS987654321.',
    type: 'order',
    read: false,
    createdAt: new Date('2023-07-11T11:00:00').toISOString(),
  },
  {
    id: '3',
    userId: 'user1',
    title: 'Summer Sale: 20% off Electronics',
    message: 'Enjoy 20% off all electronics this weekend. Use code SUMMER20 at checkout.',
    type: 'promotion',
    read: false,
    createdAt: new Date('2023-07-19T09:00:00').toISOString(),
  },
];

// Simulated API calls
export const getProducts = async (): Promise<Product[]> => {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProducts;
};

export const getProduct = async (id: string): Promise<Product | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockProducts.find((p) => p.id === id);
};

export const getCategories = async (): Promise<Category[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockCategories;
};

export const getCategory = async (id: string): Promise<Category | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockCategories.find((c) => c.id === id);
};

export const getOrders = async (userId: string): Promise<Order[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return mockOrders.filter((o) => o.userId === userId);
};

export const getOrder = async (id: string): Promise<Order | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockOrders.find((o) => o.id === id);
};

export const getUser = async (id: string): Promise<User | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (id === 'user1') {
    return mockUser;
  }
  return undefined;
};

export const getAddresses = async (userId: string): Promise<Address[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (userId === 'user1') {
    return mockUser.addresses;
  }
  return [];
};

export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (userId === 'user1') {
    return mockUser.paymentMethods;
  }
  return [];
};

export const getFavoriteProducts = async (userId: string): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (userId === 'user1' && mockUser.favorites.products.length > 0) {
    return mockProducts.filter((p) => mockUser.favorites.products.includes(p.id));
  }
  return [];
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (userId === 'user1') {
    return mockNotifications;
  }
  return [];
};

// Create a search function for products
export const searchProducts = async (query: string): Promise<Product[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
  );
};