import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../CartContext';
import { useTheme } from '../ThemeContext';

type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Checkout: undefined;
};

type CartScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Cart'
>;

export default function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { cart, increaseQuantity, decreaseQuantity, getTotalPrice } = useCart();
  const { colors, theme } = useTheme();

  // Handle Android status bar when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBarStyle(theme === 'light' ? 'dark-content' : 'light-content');
        StatusBar.setBackgroundColor(colors.background);
      }
    }, [theme, colors.background])
  );

  const renderCartItem = ({ item }: { item: typeof cart[0] }) => (
    <View style={[styles.cartItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemPrice, { color: colors.text }]}>
          ${item.price.toFixed(2)} × {item.quantity}
        </Text>
        <Text style={[styles.itemTotal, { color: colors.text }]}>
          Subtotal: ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>

      <View style={styles.quantityContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.quantityButton,
            { backgroundColor: colors.buttonBackground },
            pressed && styles.pressed,
          ]}
          onPress={() => decreaseQuantity(item.id)}
        >
          <Text style={[styles.quantityButtonText, { color: colors.buttonText }]}>
            -
          </Text>
        </Pressable>
        <Text style={[styles.quantityText, { color: colors.text }]}>
          {item.quantity}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.quantityButton,
            { backgroundColor: colors.buttonBackground },
            pressed && styles.pressed,
          ]}
          onPress={() => increaseQuantity(item.id)}
        >
          <Text style={[styles.quantityButtonText, { color: colors.buttonText }]}>
            +
          </Text>
        </Pressable>
      </View>
    </View>
  );

  if (cart.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Android Status Bar */}
        {Platform.OS === 'android' && (
          <StatusBar
            barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
            backgroundColor={colors.background}
          />
        )}
        
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Your cart is empty
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.buttonBackground },
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              Go Shopping
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

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
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>
            ← Back
          </Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>Shopping Cart</Text>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      {/* Total and Checkout Button */}
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.totalText, { color: colors.text }]}>
          Total: ${getTotalPrice().toFixed(2)}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.checkoutButton,
            { backgroundColor: colors.buttonBackground },
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={[styles.checkoutButtonText, { color: colors.buttonText }]}>
            Proceed to Checkout
          </Text>
        </Pressable>
      </View>
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
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  listContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});