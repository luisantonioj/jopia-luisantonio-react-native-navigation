// src/screens/CartScreen.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList, CartItem } from '../../types';

type CartScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Cart'
>;

export default function CartScreen() {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    getSelectedTotalPrice,
    getSelectedItemCount,
  } = useCart();
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

  const allSelected = cart.length > 0 && cart.every(item => item.isSelected);
  const someSelected = cart.some(item => item.isSelected);

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity === 1) {
      // Show confirmation dialog before deleting
      Alert.alert(
        'Remove Item',
        `Are you sure you want to remove "${item.name} (Size: ${item.size})" from your cart?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => decreaseQuantity(item.id),
          },
        ]
      );
    } else {
      decreaseQuantity(item.id);
    }
  };

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAllItems();
    } else {
      selectAllItems();
    }
  };

  const handleCheckout = () => {
    const selectedItems = cart.filter(item => item.isSelected);
    
    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item to checkout.');
      return;
    }
    
    navigation.navigate('Checkout');
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.cartItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      {/* Checkbox */}
      <Pressable
        style={({ pressed }) => [
          styles.checkbox,
          {
            backgroundColor: item.isSelected ? colors.buttonBackground : colors.background,
            borderColor: item.isSelected ? colors.buttonBackground : colors.border,
          },
          pressed && styles.checkboxPressed,
        ]}
        onPress={() => toggleItemSelection(item.id)}
      >
        {item.isSelected && (
          <Text style={[styles.checkmark, { color: colors.buttonText }]}>✓</Text>
        )}
      </Pressable>

      {/* Product Image */}
      <Image
        source={item.image}
        style={styles.itemImage}
        resizeMode="cover"
      />

      {/* Product Info */}
      <View style={styles.itemInfo}>
        <Text style={[styles.itemName, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.itemSize, { color: colors.text, opacity: 0.6 }]}>
          Size: {item.size}
        </Text>
        <Text style={[styles.itemPrice, { color: colors.text }]}>
          ₱{item.price.toFixed(2)}
        </Text>
        <Text style={[styles.itemSubtotal, { color: colors.text }]}>
          Subtotal: ₱{(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>

      {/* Quantity Controls */}
      <View style={styles.quantityContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.quantityButton,
            { backgroundColor: colors.buttonBackground },
            pressed && styles.pressed,
          ]}
          onPress={() => handleDecreaseQuantity(item)}
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
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🛒</Text>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Your cart is empty
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.text, opacity: 0.6 }]}>
            Add some awesome DLSU merch!
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
        <Text style={[styles.title, { color: colors.text }]}>Shopping Cart</Text>
      </View>

      {/* Select All */}
      <View style={[styles.selectAllContainer, { borderBottomColor: colors.border }]}>
        <Pressable
          style={({ pressed }) => [
            styles.selectAllButton,
            pressed && styles.pressed,
          ]}
          onPress={handleSelectAll}
        >
          <View style={[
            styles.checkbox,
            {
              backgroundColor: allSelected ? colors.buttonBackground : colors.background,
              borderColor: allSelected ? colors.buttonBackground : colors.border,
            },
          ]}>
            {allSelected && (
              <Text style={[styles.checkmark, { color: colors.buttonText }]}>✓</Text>
            )}
          </View>
          <Text style={[styles.selectAllText, { color: colors.text }]}>
            Select All ({cart.length})
          </Text>
        </Pressable>
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

      {/* Footer with Total and Checkout */}
      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.cardBackground }]}>
        <View style={styles.footerTop}>
          <View>
            <Text style={[styles.selectedItemsText, { color: colors.text, opacity: 0.6 }]}>
              Selected ({getSelectedItemCount()} {getSelectedItemCount() === 1 ? 'item' : 'items'})
            </Text>
            <Text style={[styles.totalText, { color: colors.text }]}>
              ₱{getSelectedTotalPrice().toFixed(2)}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.checkoutButton,
              {
                backgroundColor: someSelected ? colors.buttonBackground : colors.border,
              },
              pressed && someSelected && styles.pressed,
            ]}
            onPress={handleCheckout}
            disabled={!someSelected}
          >
            <Text
              style={[
                styles.checkoutButtonText,
                { color: someSelected ? colors.buttonText : colors.text },
              ]}
            >
              Proceed to Checkout
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  selectAllContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectAllText: {
    fontSize: 15,
    fontWeight: '600',
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
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  checkboxPressed: {
    opacity: 0.7,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemImage: {
    width: 80,
    height: 80,
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
  itemPrice: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemSubtotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItemsText: {
    fontSize: 13,
    marginBottom: 4,
  },
  totalText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  checkoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});