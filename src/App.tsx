import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

// Layout components
import MainLayout from '@/components/layouts/MainLayout';

// Pages
import HomePage from '@/pages/Index';
import NotFound from '@/pages/NotFound';

// Auth pages
import LoginPage from '@/pages/auth/Login';
import RegisterPage from '@/pages/auth/Register';
import ForgotPasswordPage from '@/pages/auth/ForgotPassword';

// Product pages
import ProductListPage from '@/pages/product/ProductList';
import ProductDetailPage from '@/pages/product/ProductDetail';
import SearchResultsPage from '@/pages/product/SearchResults';

// Category pages
import CategoryPage from '@/pages/category/Category';

// Cart and checkout pages
import CartPage from '@/pages/cart/Cart';
import CheckoutPage from '@/pages/checkout/Checkout';
import OrderConfirmationPage from '@/pages/checkout/OrderConfirmation';

// Account pages
import AccountPage from '@/pages/account/Account';
import ProfilePage from '@/pages/account/Profile';
import AddressesPage from '@/pages/account/Addresses';
import PaymentMethodsPage from '@/pages/account/PaymentMethods';
import NotificationsPage from '@/pages/account/Notifications';

// Order pages
import OrdersPage from '@/pages/orders/Orders';
import OrderDetailPage from '@/pages/orders/OrderDetail';

// Favorites page
import FavoritesPage from '@/pages/account/Favorites';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
              
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Product routes */}
              <Route path="/products" element={<MainLayout><ProductListPage /></MainLayout>} />
              <Route path="/product/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
              <Route path="/search" element={<MainLayout><SearchResultsPage /></MainLayout>} />
              
              {/* Category routes */}
              <Route path="/category/:id" element={<MainLayout><CategoryPage /></MainLayout>} />
              
              {/* Cart and checkout routes */}
              <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
              <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
              <Route path="/order-confirmation/:orderId" element={<MainLayout><OrderConfirmationPage /></MainLayout>} />
              
              {/* Account routes */}
              <Route path="/account" element={<MainLayout><AccountPage /></MainLayout>} />
              <Route path="/account/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
              <Route path="/account/addresses" element={<MainLayout><AddressesPage /></MainLayout>} />
              <Route path="/account/payment-methods" element={<MainLayout><PaymentMethodsPage /></MainLayout>} />
              <Route path="/account/notifications" element={<MainLayout><NotificationsPage /></MainLayout>} />
              
              {/* Order routes */}
              <Route path="/orders" element={<MainLayout><OrdersPage /></MainLayout>} />
              <Route path="/order/:id" element={<MainLayout><OrderDetailPage /></MainLayout>} />
              
              {/* Favorites route */}
              <Route path="/favorites" element={<MainLayout><FavoritesPage /></MainLayout>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
