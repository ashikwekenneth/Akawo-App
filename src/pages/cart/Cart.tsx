import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CartItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  ShoppingBasket
} from 'lucide-react';

const CartPage = () => {
  const { cart, updateCartItem, removeFromCart, clearCart, calculateTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const { subtotal, shipping, tax, total } = calculateTotal();
  const isEmpty = !cart || cart.items.length === 0;
  
  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartItem(item.productId, newQuantity);
  };
  
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=checkout');
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      {isEmpty ? (
        <div className="text-center py-16">
          <div className="mb-6 flex justify-center">
            <ShoppingBasket className="h-16 w-16 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Cart Items ({cart?.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart?.items.map((item) => (
                    <div key={`${item.productId}-${JSON.stringify(item.attributes)}`} className="flex flex-col sm:flex-row gap-4 py-4 border-b">
                      {/* Product Image */}
                      <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                        <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={item.productImage} 
                            alt={item.productName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <Link to={`/product/${item.productId}`}>
                          <h3 className="font-medium hover:text-primary">{item.productName}</h3>
                        </Link>
                        
                        {/* Product Attributes */}
                        {item.attributes && Object.keys(item.attributes).length > 0 && (
                          <div className="mt-1 text-sm text-muted-foreground">
                            {Object.entries(item.attributes).map(([key, value]) => (
                              <span key={key}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}: {value as string}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateQuantity(item, parseInt(e.target.value) || 1)}
                              className="h-8 w-16 text-center rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {/* Price and Remove */}
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                            <div className="text-right">
                              <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                              <p className="text-xs text-muted-foreground">
                                ${item.unitPrice.toFixed(2)} each
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2"
                              onClick={() => handleRemoveItem(item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Cart Actions */}
                <div className="flex justify-between mt-6">
                  <Button variant="outline" size="sm" onClick={handleClearCart}>
                    Clear Cart
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Coupon code */}
                <div className="mt-6">
                  <div className="flex gap-2">
                    <Input placeholder="Enter coupon code" />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
              
              {/* Payment methods */}
              <div className="px-6 pb-6">
                <p className="text-xs text-center text-muted-foreground">
                  Secure payment options available
                </p>
                <div className="mt-2 flex justify-center gap-2">
                  <img src="https://placehold.co/40x25/e2e8f0/a0aec0?text=VISA" alt="Visa" className="h-6" />
                  <img src="https://placehold.co/40x25/e2e8f0/a0aec0?text=MC" alt="Mastercard" className="h-6" />
                  <img src="https://placehold.co/40x25/e2e8f0/a0aec0?text=PAYPAL" alt="PayPal" className="h-6" />
                  <img src="https://placehold.co/40x25/e2e8f0/a0aec0?text=STRIPE" alt="Stripe" className="h-6" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;