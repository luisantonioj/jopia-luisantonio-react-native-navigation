// src/components/ProductCard.tsx

import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { 
          backgroundColor: colors.cardBackground,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
      onPress={() => onPress(product)}
    >
      {/* Product Image */}
      <Image 
        source={product.images[0].source} 
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text 
          style={[styles.name, { color: colors.text }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        
        <Text style={[styles.category, { color: colors.text, opacity: 0.6 }]}>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Text>
        
        <Text style={[styles.price, { color: colors.text }]}>
          ₱{product.price.toFixed(2)}
        </Text>
      </View>
      
      {/* Add to Cart Button */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: colors.buttonBackground },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => onPress(product)}
        >
          <Text style={[styles.addButtonText, { color: colors.buttonText }]}>
            Select Size
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 12,
    paddingTop: 0,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});