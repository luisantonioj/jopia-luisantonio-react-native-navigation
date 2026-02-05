// src/data/products.ts

import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'DLSU GA Shirt',
    price: 1250,
    category: 'shirt',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      { source: require('../../assets/images/DLSU GA SHIRT FRONT.png'), label: 'Front' },
      { source: require('../../assets/images/DLSU GA SHIRT BACK.png'), label: 'Back' },
    ],
    description: 'Official DLSU Green Archers shirt',
  },
  {
    id: '2',
    name: 'GA Baseball Shirt',
    price: 800,
    category: 'shirt',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      { source: require('../../assets/images/GA BASEBALL SHIRT FRONT.png'), label: 'Front' },
      { source: require('../../assets/images/GA BASEBALL SHIRT BACK.png'), label: 'Back' },
    ],
    description: 'Green Archers baseball style shirt',
  },
  {
    id: '3',
    name: 'GA 1911 Shirt',
    price: 800,
    category: 'shirt',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      { source: require('../../assets/images/GA 1911 SHIRT FRONT.png'), label: 'Front' },
    ],
    description: 'Commemorative 1911 Green Archers shirt',
  },
  {
    id: '4',
    name: 'Animo Cheer Shirt',
    price: 800,
    category: 'shirt',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      { source: require('../../assets/images/ANIMO CHEER SHIRT FRONT.png'), label: 'Front' },
    ],
    description: 'Show your school spirit with Animo!',
  },
  {
    id: '5',
    name: 'GA DLSU Retro Shirt',
    price: 800,
    category: 'shirt',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      { source: require('../../assets/images/GA DLSU RETRO SHIRT FRONT.png'), label: 'Front' },
      { source: require('../../assets/images/GA DLSU RETRO SHIRT BACK.png'), label: 'Back' },
    ],
    description: 'Vintage-style DLSU retro shirt',
  },
  {
    id: '6',
    name: 'DLSU 1911 Cap',
    price: 950,
    category: 'cap',
    availableSizes: ['One Size'],
    images: [
      { source: require('../../assets/images/DLSU 1911 CAP FRONT.png'), label: 'Front' },
      { source: require('../../assets/images/DLSU 1911 CAP BACK.png'), label: 'Back' },
      { source: require('../../assets/images/DLSU 1911 CAP LEFT SIDE.png'), label: 'Left' },
      { source: require('../../assets/images/DLSU 1911 CAP RIGHT SIDE.png'), label: 'Right' },
    ],
    description: 'Adjustable DLSU 1911 commemorative cap',
  },
  {
    id: '7',
    name: 'DLSU Hoodie',
    price: 1750,
    category: 'hoodie',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      { source: require('../../assets/images/DLSU HOODIE FRONT.png'), label: 'Front' },
      { source: require('../../assets/images/DLSU HOODIE BACK.png'), label: 'Back' },
    ],
    description: 'Comfortable DLSU hoodie for cold weather',
  },
  {
    id: '8',
    name: 'DLSU Sweatshirt',
    price: 1500,
    category: 'sweatshirt',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      { source: require('../../assets/images/DLSU SWEATSHIRT FRONT.png'), label: 'Front' },
      { source: require('../../assets/images/DLSU SWEATSHIRT BACK.png'), label: 'Back' },
    ],
    description: 'Premium DLSU sweatshirt',
  },
];

// Helper function to get product by ID
export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(product => product.id === id);
};

// Helper function to get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return PRODUCTS.filter(product => product.category === category);
};