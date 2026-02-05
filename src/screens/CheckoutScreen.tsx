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
} from 'react-native';
import { useNavigation, useFocusEffect, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
  Checkout: undefined;
};

type CheckoutScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Checkout'
>;

export default function CheckoutScreen() {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const { cart, getTotalPrice, clearCart } = useCart();
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

  const handleCheckout = () => {
    Alert.alert(
      'Checkout Successful',
      'Your order has been placed successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            clearCart();
            // Use reset to clear navigation stack and prevent back button issues
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              })
            );
          },
        },
      ]
    );
  };

  const renderOrderItem = ({ item }: { item: typeof cart[0] }) => (
    <View style={[styles.orderItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemDetails, { color: colors.text }]}>
          ${item.price.toFixed(2)} × {item.quantity}
        </Text>
      </View>
      <Text style={[styles.itemTotal, { color: colors.text }]}>
        ${(item.price * item.quantity).toFixed(2)}
      </Text>
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
            No items to checkout
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
        <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
      </View>

      {/* Order Summary */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
      
      <FlatList
        data={cart}
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
          <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount:</Text>
          <Text style={[styles.totalAmount, { color: colors.text }]}>
            ${getTotalPrice().toFixed(2)}
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
            Checkout
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 12,
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
  orderItem: {
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
  itemDetails: {
    fontSize: 14,
  },
  itemTotal: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 20,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
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