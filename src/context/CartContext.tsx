import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Cart, CartItem, Product, Currency } from '@/types';

// Cart Context Types
type CartState = {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
};

type CartAction = 
  | { type: 'LOAD_CART_START' }
  | { type: 'LOAD_CART_SUCCESS'; payload: Cart }
  | { type: 'LOAD_CART_FAILURE'; payload: string }
  | { type: 'ADD_TO_CART_START' }
  | { type: 'ADD_TO_CART_SUCCESS'; payload: Cart }
  | { type: 'ADD_TO_CART_FAILURE'; payload: string }
  | { type: 'UPDATE_ITEM_START' }
  | { type: 'UPDATE_ITEM_SUCCESS'; payload: Cart }
  | { type: 'UPDATE_ITEM_FAILURE'; payload: string }
  | { type: 'REMOVE_ITEM_START' }
  | { type: 'REMOVE_ITEM_SUCCESS'; payload: Cart }
  | { type: 'REMOVE_ITEM_FAILURE'; payload: string }
  | { type: 'CLEAR_CART_START' }
  | { type: 'CLEAR_CART_SUCCESS'; payload: Cart }
  | { type: 'CLEAR_CART_FAILURE'; payload: string }
  | { type: 'APPLY_COUPON_SUCCESS'; payload: Cart }
  | { type: 'APPLY_COUPON_FAILURE'; payload: string }
  | { type: 'REMOVE_COUPON_SUCCESS'; payload: Cart }
  | { type: 'CLEAR_ERROR' };

type CartContextType = CartState & {
  addToCart: (product: Product, quantity: number, attributes?: Record<string, string>) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => Promise<void>;
  clearError: () => void;
  calculateTotal: () => { subtotal: number; shipping: number; tax: number; total: number };
};

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

// Create an empty cart object
const createEmptyCart = (userId: string = 'guest'): Cart => ({
  _id: `cart_${Math.random().toString(36).substring(2, 9)}`,
  userId,
  items: [],
  subtotal: 0,
  totalShipping: 0,
  totalTax: 0,
  totalPrice: 0,
  currency: 'USD',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Cart Context Creation
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD_CART_START':
    case 'ADD_TO_CART_START':
    case 'UPDATE_ITEM_START':
    case 'REMOVE_ITEM_START':
    case 'CLEAR_CART_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_CART_SUCCESS':
    case 'ADD_TO_CART_SUCCESS':
    case 'UPDATE_ITEM_SUCCESS':
    case 'REMOVE_ITEM_SUCCESS':
    case 'CLEAR_CART_SUCCESS':
    case 'APPLY_COUPON_SUCCESS':
    case 'REMOVE_COUPON_SUCCESS':
      return { ...state, cart: action.payload, loading: false, error: null };
    case 'LOAD_CART_FAILURE':
    case 'ADD_TO_CART_FAILURE':
    case 'UPDATE_ITEM_FAILURE':
    case 'REMOVE_ITEM_FAILURE':
    case 'CLEAR_CART_FAILURE':
    case 'APPLY_COUPON_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Calculate cart totals
const calculateCartTotals = (items: CartItem[]): { subtotal: number; shipping: number; tax: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  // In a real app, shipping would be calculated based on location, weight, etc.
  const shipping = items.length > 0 ? 10 : 0;
  // Simplified tax calculation (would normally depend on location)
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  
  return { subtotal, shipping, tax, total };
};

// Cart Provider Component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from local storage on mount
  useEffect(() => {
    const loadStoredCart = async () => {
      dispatch({ type: 'LOAD_CART_START' });
      try {
        const storedCart = localStorage.getItem('akawo_cart');
        if (storedCart) {
          dispatch({ 
            type: 'LOAD_CART_SUCCESS', 
            payload: JSON.parse(storedCart) 
          });
        } else {
          // Create a new cart if none exists
          const newCart = createEmptyCart();
          localStorage.setItem('akawo_cart', JSON.stringify(newCart));
          dispatch({ type: 'LOAD_CART_SUCCESS', payload: newCart });
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
        dispatch({
          type: 'LOAD_CART_FAILURE',
          payload: 'Failed to load your shopping cart'
        });
      }
    };
    
    loadStoredCart();
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    if (state.cart) {
      localStorage.setItem('akawo_cart', JSON.stringify(state.cart));
    }
  }, [state.cart]);

  // Add product to cart
  const addToCart = async (product: Product, quantity: number, attributes?: Record<string, string>) => {
    dispatch({ type: 'ADD_TO_CART_START' });
    try {
      // Clone the current cart or create a new one
      const currentCart = state.cart ? { ...state.cart } : createEmptyCart();
      
      // Check if the item already exists in the cart
      const existingItemIndex = currentCart.items.findIndex(item => 
        item.productId === product._id && 
        JSON.stringify(item.attributes) === JSON.stringify(attributes)
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedItems = [...currentCart.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          totalPrice: (updatedItems[existingItemIndex].quantity + quantity) * updatedItems[existingItemIndex].unitPrice
        };
        currentCart.items = updatedItems;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          productId: product._id,
          productName: product.name,
          productImage: product.images && product.images.length > 0 ? product.images[0].url : '',
          quantity,
          unitPrice: product.discountPrice || product.price,
          totalPrice: (product.discountPrice || product.price) * quantity,
          sellerId: product.sellerId,
          attributes
        };
        currentCart.items = [...currentCart.items, newItem];
      }
      
      // Recalculate cart totals
      const { subtotal, shipping, tax, total } = calculateCartTotals(currentCart.items);
      currentCart.subtotal = subtotal;
      currentCart.totalShipping = shipping;
      currentCart.totalTax = tax;
      currentCart.totalPrice = total;
      currentCart.updatedAt = new Date();
      
      dispatch({ type: 'ADD_TO_CART_SUCCESS', payload: currentCart });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      dispatch({
        type: 'ADD_TO_CART_FAILURE',
        payload: 'Failed to add item to cart'
      });
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId: string, quantity: number) => {
    if (!state.cart) return;
    
    dispatch({ type: 'UPDATE_ITEM_START' });
    try {
      const currentCart = { ...state.cart };
      const itemIndex = currentCart.items.findIndex(item => item.productId === productId);
      
      if (itemIndex === -1) {
        throw new Error('Item not found in cart');
      }
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        currentCart.items = currentCart.items.filter(item => item.productId !== productId);
      } else {
        // Update item quantity
        const updatedItems = [...currentCart.items];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity,
          totalPrice: quantity * updatedItems[itemIndex].unitPrice
        };
        currentCart.items = updatedItems;
      }
      
      // Recalculate cart totals
      const { subtotal, shipping, tax, total } = calculateCartTotals(currentCart.items);
      currentCart.subtotal = subtotal;
      currentCart.totalShipping = shipping;
      currentCart.totalTax = tax;
      currentCart.totalPrice = total;
      currentCart.updatedAt = new Date();
      
      dispatch({ type: 'UPDATE_ITEM_SUCCESS', payload: currentCart });
    } catch (error) {
      console.error('Failed to update cart item:', error);
      dispatch({
        type: 'UPDATE_ITEM_FAILURE',
        payload: 'Failed to update cart item'
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    if (!state.cart) return;
    
    dispatch({ type: 'REMOVE_ITEM_START' });
    try {
      const currentCart = { ...state.cart };
      currentCart.items = currentCart.items.filter(item => item.productId !== productId);
      
      // Recalculate cart totals
      const { subtotal, shipping, tax, total } = calculateCartTotals(currentCart.items);
      currentCart.subtotal = subtotal;
      currentCart.totalShipping = shipping;
      currentCart.totalTax = tax;
      currentCart.totalPrice = total;
      currentCart.updatedAt = new Date();
      
      dispatch({ type: 'REMOVE_ITEM_SUCCESS', payload: currentCart });
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      dispatch({
        type: 'REMOVE_ITEM_FAILURE',
        payload: 'Failed to remove item from cart'
      });
    }
  };

  // Clear cart
  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART_START' });
    try {
      const newCart = createEmptyCart(state.cart?.userId);
      dispatch({ type: 'CLEAR_CART_SUCCESS', payload: newCart });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      dispatch({
        type: 'CLEAR_CART_FAILURE',
        payload: 'Failed to clear cart'
      });
    }
  };

  // Apply coupon code
  const applyCoupon = async (code: string) => {
    if (!state.cart) return;
    
    try {
      // In a real app, validate coupon with the backend
      // For now, simulate a 10% discount
      const currentCart = { ...state.cart };
      
      // Apply discount to subtotal
      const discount = currentCart.subtotal * 0.1;
      currentCart.totalPrice = currentCart.totalPrice - discount;
      currentCart.appliedCoupons = currentCart.appliedCoupons ? [...currentCart.appliedCoupons, code] : [code];
      currentCart.updatedAt = new Date();
      
      dispatch({ type: 'APPLY_COUPON_SUCCESS', payload: currentCart });
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      dispatch({
        type: 'APPLY_COUPON_FAILURE',
        payload: 'Invalid coupon code or already applied'
      });
    }
  };

  // Remove coupon code
  const removeCoupon = async (code: string) => {
    if (!state.cart || !state.cart.appliedCoupons) return;
    
    try {
      const currentCart = { ...state.cart };
      
      // Remove discount (simplified)
      // In a real app, recalculate based on removed coupon
      currentCart.totalPrice = currentCart.subtotal + currentCart.totalShipping + currentCart.totalTax;
      currentCart.appliedCoupons = currentCart.appliedCoupons.filter(c => c !== code);
      currentCart.updatedAt = new Date();
      
      dispatch({ type: 'REMOVE_COUPON_SUCCESS', payload: currentCart });
    } catch (error) {
      console.error('Failed to remove coupon:', error);
      dispatch({
        type: 'APPLY_COUPON_FAILURE',
        payload: 'Failed to remove coupon'
      });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Calculate cart totals for display
  const calculateTotal = () => {
    if (!state.cart || state.cart.items.length === 0) {
      return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    }
    
    return {
      subtotal: state.cart.subtotal,
      shipping: state.cart.totalShipping,
      tax: state.cart.totalTax,
      total: state.cart.totalPrice
    };
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        clearError,
        calculateTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};