// src/screens/CheckoutScreen.tsx

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
  Image,
} from 'react-native';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList, CartItem } from '../types';

type CheckoutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Checkout'
>;

export default function CheckoutScreen() {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { cart, getSelectedTotalPrice, clearSelectedItems } = useCart();
  const { colors, theme } = useTheme();

  // Filter to only show selected items
  const selectedItems = cart.filter(item => item.isSelected);

  // Handle Android status bar when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'android') {
        StatusBar.setBarStyle(theme === 'light' ? 'dark-content' : 'light-content');
        StatusBar.setBackgroundColor(colors.background);
      }
    }, [theme, colors.background])
  );

  const handleCheckout = () => {
    Alert.alert(
      'Confirm Checkout',
      `Place this order?\n\nItems: ${selectedItems.length}\nTotal: ₱${getSelectedTotalPrice().toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Place Order',
          style: 'destructive',
          onPress: confirmCheckout,
        },
      ]
    );
  };

  const confirmCheckout = () => {
    const unselectedCount = cart.filter(item => !item.isSelected).length;
    const checkoutMessage = unselectedCount > 0
      ? `Your order has been placed successfully!\n\nYou have ${unselectedCount} ${unselectedCount === 1 ? 'item' : 'items'} remaining in your cart.`
      : 'Your order has been placed successfully!\n\nThank you for supporting DLSU Green Archers!';

    Alert.alert(
      'Checkout Successful! 🎉',
      checkoutMessage,
      [
        {
          text: 'OK',
          onPress: () => {
            clearSelectedItems(); // Only remove selected items
            // Navigate to appropriate screen
            if (unselectedCount > 0) {
              // If items remain, go back to cart
              navigation.goBack();
            } else {
              // If cart is empty, reset to home
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                })
              );
            }
          },
        },
      ]
    );
  };

  const renderOrderItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.orderItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <Image
        source={item.image}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.itemSize, { color: colors.text, opacity: 0.6 }]}>
          Size: {item.size}
        </Text>
        <Text style={[styles.itemDetails, { color: colors.text }]}>
          ₱{item.price.toFixed(2)} × {item.quantity}
        </Text>
      </View>
      <Text style={[styles.itemTotal, { color: colors.text }]}>
        ₱{(item.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  if (selectedItems.length === 0) {
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
          <Text style={{ fontSize: 64, marginBottom: 16 }}>📦</Text>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No items to checkout
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.text, opacity: 0.6 }]}>
            Add items to your cart first
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.buttonBackground },
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              })
            )}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              Start Shopping
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
        <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
      </View>

      {/* Order Summary */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Order Summary
        </Text>
        <Text style={[styles.itemCount, { color: colors.text, opacity: 0.6 }]}>
          {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <FlatList
        data={selectedItems}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      {/* Total and Checkout Button */}
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.cardBackground }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>
            Total Amount:
          </Text>
          <Text style={[styles.totalAmount, { color: colors.text }]}>
            ₱{getSelectedTotalPrice().toFixed(2)}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.checkoutButton,
            { backgroundColor: colors.buttonBackground },
            pressed && styles.pressed,
          ]}
          onPress={handleCheckout}
        >
          <Text style={[styles.checkoutButtonText, { color: colors.buttonText }]}>
            Place Order
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
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
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 12,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 13,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});