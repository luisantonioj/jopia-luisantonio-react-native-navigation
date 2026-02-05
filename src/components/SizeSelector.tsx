// src/components/SizeSelector.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Product, ProductSize } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SizeSelectorProps {
  visible: boolean;
  product: Product | null;
  onClose: () => void;
  onSelectSize: (size: ProductSize) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  visible,
  product,
  onClose,
  onSelectSize,
}) => {
  const { colors } = useTheme();
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

  if (!product) return null;

  const handleConfirm = () => {
    if (selectedSize) {
      onSelectSize(selectedSize);
      setSelectedSize(null);
    }
  };

  const handleClose = () => {
    setSelectedSize(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Select Size
            </Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Product Info */}
            <View style={styles.productInfo}>
              <Image 
                source={product.images[0].source} 
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productDetails}>
                <Text style={[styles.productName, { color: colors.text }]}>
                  {product.name}
                </Text>
                <Text style={[styles.productPrice, { color: colors.text }]}>
                  ₱{product.price.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Size Options */}
            <View style={styles.sizesContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Available Sizes
              </Text>
              <View style={styles.sizeGrid}>
                {product.availableSizes.map((size) => (
                  <Pressable
                    key={size}
                    style={({ pressed }) => [
                      styles.sizeOption,
                      {
                        backgroundColor: selectedSize === size 
                          ? colors.buttonBackground 
                          : colors.cardBackground,
                        borderColor: selectedSize === size
                          ? colors.buttonBackground
                          : colors.border,
                      },
                      pressed && styles.sizePressed,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        {
                          color: selectedSize === size
                            ? colors.buttonText
                            : colors.text,
                        },
                      ]}
                    >
                      {size}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Product Description */}
            {product.description && (
              <View style={styles.descriptionContainer}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Description
                </Text>
                <Text style={[styles.description, { color: colors.text, opacity: 0.7 }]}>
                  {product.description}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Add to Cart Button */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor: selectedSize 
                    ? colors.buttonBackground 
                    : colors.border,
                },
                pressed && selectedSize && styles.buttonPressed,
              ]}
              onPress={handleConfirm}
              disabled={!selectedSize}
            >
              <Text
                style={[
                  styles.addButtonText,
                  { color: selectedSize ? colors.buttonText : colors.text },
                ]}
              >
                {selectedSize ? 'Add to Cart' : 'Select a size'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  productInfo: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sizesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sizeOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    minWidth: 70,
    alignItems: 'center',
  },
  sizePressed: {
    opacity: 0.7,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  addButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.8,
  },
});