// src/screens/HomeScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { PRODUCTS } from '../data/products';
import { ProductCard, SizeSelector } from '../components';
import { Product, ProductSize, RootStackParamList } from '../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { addToCart, getCartItemCount } = useCart();
  const { colors, theme, toggleTheme } = useTheme();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);

  // Handle Android status bar when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBarStyle(theme === 'light' ? 'dark-content' : 'light-content');
        StatusBar.setBackgroundColor(colors.background);
      }
    }, [theme, colors.background])
  );

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setSizeModalVisible(true);
  };

  const handleSizeSelect = (size: ProductSize, quantity: number) => {
    if (selectedProduct) {
      addToCart(selectedProduct, size, quantity);
      setSizeModalVisible(false);
      Alert.alert(
        'Added to Cart',
        `${quantity} × ${selectedProduct.name} (Size: ${size}) ${quantity === 1 ? 'has' : 'have'} been added to your cart!`,
        [{ text: 'OK' }]
      );
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={handleProductPress} />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Android Status Bar */}
      {Platform.OS === 'android' && (
        <StatusBar
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={colors.background}
        />
      )}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>DLSU Merch</Text>
          <Text style={[styles.subtitle, { color: colors.text, opacity: 0.6 }]}>
            Official Green Archers Merchandise
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.themeButton,
              { backgroundColor: colors.cardBackground },
              pressed && styles.pressed,
            ]}
            onPress={toggleTheme}
          >
            <Text style={{ fontSize: 20 }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.cartButton,
              { backgroundColor: colors.buttonBackground },
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={[styles.cartButtonText, { color: colors.buttonText }]}>
              🛒 {getCartItemCount()}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Product List */}
      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
      />

      {/* Size Selection Modal */}
      <SizeSelector
        visible={sizeModalVisible}
        product={selectedProduct}
        onClose={() => setSizeModalVisible(false)}
        onSelectSize={handleSizeSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeButton: {
    padding: 10,
    borderRadius: 8,
  },
  cartButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cartButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  listContainer: {
    padding: 16,
  },
});