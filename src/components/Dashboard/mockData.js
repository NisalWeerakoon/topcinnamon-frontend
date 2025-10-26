// Mock data for testing - replace with real API calls later
export const mockOrders = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    items: [
      { name: 'Ceylon Cinnamon Powder', quantity: 2, price: 24.99 },
      { name: 'Cinnamon Sticks', quantity: 1, price: 19.99 }
    ],
    total: 125.50,
    status: 'delivered',
    shippingAddress: '123 Main St, Colombo, Sri Lanka',
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'ORD-002',
    date: '2024-01-20',
    items: [
      { name: 'Cinnamon Oil', quantity: 2, price: 44.99 }
    ],
    total: 89.99,
    status: 'shipping',
    shippingAddress: '456 Beach Rd, Galle, Sri Lanka',
    trackingNumber: 'TRK987654321'
  },
  {
    id: 'ORD-003',
    date: '2024-01-25',
    items: [
      { name: 'Ceylon Cinnamon Powder (Bulk)', quantity: 10, price: 22.50 },
      { name: 'Gift Hamper', quantity: 1, price: 79.99 }
    ],
    total: 245.00,
    status: 'processing',
    shippingAddress: '789 Hill View, Kandy, Sri Lanka',
    trackingNumber: null
  }
];

export const mockWishlist = [
  {
    id: 1,
    name: 'Premium Ceylon Cinnamon Powder',
    price: 24.99,
    imageFilename: 'cinnamon-powder.jpg',
    inStock: true
  },
  {
    id: 2,
    name: 'Organic Cinnamon Sticks',
    price: 19.99,
    imageFilename: 'cinnamon-sticks.jpg',
    inStock: true
  },
  {
    id: 3,
    name: 'Cinnamon Essential Oil',
    price: 44.99,
    imageFilename: 'cinnamon-oil.jpg',
    inStock: false
  }
];

export const mockReviews = [
  {
    id: 1,
    productId: 5,
    productName: 'Ceylon Cinnamon Oil',
    rating: 5,
    comment: 'Excellent quality! The aroma is absolutely amazing. Will definitely buy again.',
    date: '2024-01-10',
    helpful: 12
  },
  {
    id: 2,
    productId: 2,
    productName: 'Cinnamon Powder',
    rating: 4,
    comment: 'Great product, fast delivery. The packaging was excellent too.',
    date: '2024-01-05',
    helpful: 8
  },
  {
    id: 3,
    productId: 3,
    productName: 'Organic Cinnamon Sticks',
    rating: 5,
    comment: 'Best cinnamon sticks I have ever purchased. Authentic Ceylon quality!',
    date: '2023-12-28',
    helpful: 15
  }
];