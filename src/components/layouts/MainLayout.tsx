import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const cartItemsCount = cart?.items?.length || 0;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Main categories for the navigation menu
  const categories = [
    { name: 'Grains & Cereals', slug: 'grains-cereals' },
    { name: 'Spices & Seasonings', slug: 'spices-seasonings' },
    { name: 'Snacks & Sweets', slug: 'snacks-sweets' },
    { name: 'Beverages', slug: 'beverages' },
    { name: 'Prepared Foods', slug: 'prepared-foods' },
    { name: 'Fresh Produce', slug: 'fresh-produce' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex flex-col gap-4 py-4">
                    <SheetClose asChild>
                      <Link to="/" className="text-2xl font-bold text-primary">
                        Akawo
                      </Link>
                    </SheetClose>
                    <div className="flex flex-col space-y-3 mt-4">
                      <SheetClose asChild>
                        <Link to="/products" className="text-lg hover:text-primary">All Products</Link>
                      </SheetClose>
                      {categories.map((category) => (
                        <SheetClose key={category.slug} asChild>
                          <Link to={`/category/${category.slug}`} className="text-lg hover:text-primary">
                            {category.name}
                          </Link>
                        </SheetClose>
                      ))}
                      <div className="border-t my-2"></div>
                      {isAuthenticated ? (
                        <>
                          <SheetClose asChild>
                            <Link to="/account" className="text-lg hover:text-primary">My Account</Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link to="/orders" className="text-lg hover:text-primary">My Orders</Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link to="/favorites" className="text-lg hover:text-primary">Favorites</Link>
                          </SheetClose>
                          <Button variant="outline" onClick={logout}>
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <div className="flex flex-col space-y-2">
                          <SheetClose asChild>
                            <Button asChild variant="default">
                              <Link to="/login">Sign In</Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button asChild variant="outline">
                              <Link to="/register">Create Account</Link>
                            </Button>
                          </SheetClose>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-primary">
              Akawo
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/products" className={navigationMenuTriggerStyle()}>
                      All Products
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {categories.map((category) => (
                          <li key={category.slug}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={`/category/${category.slug}`}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{category.name}</div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 mx-6">
              <form onSubmit={handleSearch} className="w-full max-w-lg relative">
                <Input
                  type="search"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full pr-10"
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link to="/favorites" className="text-gray-600 hover:text-primary">
                <Heart className="h-6 w-6" />
              </Link>
              <Link to="/cart" className="text-gray-600 hover:text-primary relative">
                <ShoppingBag className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
              {isAuthenticated ? (
                <div className="hidden md:block relative group">
                  <Button variant="ghost" size="icon">
                    <User className="h-6 w-6" />
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                    <div className="py-1">
                      <p className="px-4 py-2 text-sm text-gray-700 border-b">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Account
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Orders
                      </Link>
                      <Link to="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Favorites
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex space-x-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/register">Create Account</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="mt-4 md:hidden">
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full"
              />
              <Button type="submit" variant="ghost" size="icon" className="ml-1">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Akawo</h3>
              <p className="text-sm text-gray-600">
                Connecting Africans in the diaspora with authentic Nigerian food products, preserving cultural identity and heritage.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-gray-600 hover:text-primary">Contact Us</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">FAQs</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">Shipping & Returns</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">Track Your Order</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Information</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-gray-600 hover:text-primary">About Us</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">Terms & Conditions</Link></li>
                <li><Link to="#" className="text-gray-600 hover:text-primary">For Sellers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-2">
                Subscribe to receive updates, promotions, and news.
              </p>
              <form className="flex">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="rounded-r-none"
                />
                <Button type="submit" className="rounded-l-none">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Akawo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;