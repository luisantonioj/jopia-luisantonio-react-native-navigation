import React from 'react';
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
import { PRODUCTS } from '../../data/products';

type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Checkout: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { addToCart, cart } = useCart();
  const { colors, theme, toggleTheme } = useTheme();

  // Handle Android status bar when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBarStyle(theme === 'light' ? 'dark-content' : 'light-content');
        StatusBar.setBackgroundColor(colors.background);
      }
    }, [theme, colors.background])
  );

  const handleAddToCart = (product: typeof PRODUCTS[0]) => {
    addToCart(product);
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const renderProduct = ({ item }: { item: typeof PRODUCTS[0] }) => (
    <View style={[styles.productCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.productPrice, { color: colors.text }]}>
          ${item.price.toFixed(2)}
        </Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          { backgroundColor: colors.buttonBackground },
          pressed && styles.pressed,
        ]}
        onPress={() => handleAddToCart(item)}
      >
        <Text style={[styles.addButtonText, { color: colors.buttonText }]}>
          Add to Cart
        </Text>
      </Pressable>
    </View>
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
        <Text style={[styles.title, { color: colors.text }]}>Products</Text>
        <View style={styles.headerButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.themeButton,
              { backgroundColor: colors.cardBackground },
              pressed && styles.pressed,
            ]}
            onPress={toggleTheme}
          >
            <Text style={{ color: colors.text }}>
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
              Go to Cart ({cart.length})
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
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
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
  },
  pressed: {
    opacity: 0.7,
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  productInfo: {
    flex: 1,
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
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  addButtonText: {
    fontWeight: '600',
  },
});