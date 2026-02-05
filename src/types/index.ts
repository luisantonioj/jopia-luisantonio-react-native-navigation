// src/types/index.ts

import { ImageSourcePropType } from 'react-native';
export type ProductCategory = 'shirt' | 'cap' | 'hoodie' | 'sweatshirt';
export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size';

export interface ProductImage {
  source: ImageSourcePropType;
  label: 'Front' | 'Back' | 'Left' | 'Right';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  images: ProductImage[];
  availableSizes: ProductSize[];
  description?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: ProductSize;
  image: ImageSourcePropType; // Primary image for cart display
  category: ProductCategory;
}

export type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Checkout: undefined;
  ProductDetail?: { productId: string };
}