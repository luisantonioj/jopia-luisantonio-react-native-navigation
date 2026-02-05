// src/context/CartContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product, ProductSize } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize) => void;
  removeFromCart: (cartItemId: string) => void;
  increaseQuantity: (cartItemId: string) => void;
  decreaseQuantity: (cartItemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartItemCount: () => number;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, size: ProductSize) => {
    setCart((prevCart) => {
      // Create unique ID combining product ID and size
      const cartItemId = `${product.id}-${size}`;
      
      // Check if this exact product with this size already exists
      const existingItem = prevCart.find((item) => item.id === cartItemId);
      
      if (existingItem) {
        // Increase quantity if exists
        return prevCart.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Add new cart item
      const newCartItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: size,
        image: product.images[0].source, // Use first image as primary
        category: product.category,
      };
      
      return [...prevCart, newCartItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
  };

  const increaseQuantity = (cartItemId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (cartItemId: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === cartItemId);
      
      if (item && item.quantity === 1) {
        // Remove item if quantity is 1
        return prevCart.filter((i) => i.id !== cartItemId);
      }
      
      return prevCart.map((i) =>
        i.id === cartItemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        getTotalPrice,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};