import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Search, Heart, X, Store, ShoppingBag } from 'lucide-react';

interface FavoriteProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  sellerId: string;
  sellerName: string;
  inStock: boolean;
}

interface FavoriteSeller {
  id: string;
  name: string;
  image: string;
  description: string;
  productCount: number;
  rating: number;
}

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  // Mock data - in a real app, this would be fetched from an API
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([
    {
      id: 'prod-1',
      name: 'Jollof Rice Mix',
      image: '/assets/products/jollof-rice-mix.jpg',
      price: 12.99,
      originalPrice: 15.99,
      discount: 20,
      sellerId: 'seller-1',
      sellerName: 'African Delicacies',
      inStock: true
    },
    {
      id: 'prod-2',
      name: 'Nigerian Honey',
      image: '/assets/products/nigerian-honey.jpg',
      price: 8.50,
      sellerId: 'seller-2',
      sellerName: 'Pure Honey Co.',
      inStock: true
    },
    {
      id: 'prod-3',
      name: 'Plantain Chips',
      image: '/assets/products/plantain-chips.jpg',
      price: 5.99,
      originalPrice: 7.99,
      discount: 25,
      sellerId: 'seller-1',
      sellerName: 'African Delicacies',
      inStock: false
    },
    {
      id: 'prod-4',
      name: 'Suya Spice',
      image: '/assets/products/suya-spice.jpg',
      price: 7.25,
      sellerId: 'seller-3',
      sellerName: 'Spice Heaven',
      inStock: true
    },
    {
      id: 'prod-5',
      name: 'Palm Oil (500ml)',
      image: '/assets/products/palm-oil.jpg',
      price: 10.99,
      sellerId: 'seller-1',
      sellerName: 'African Delicacies',
      inStock: true
    }
  ]);

  const [favoriteSellers, setFavoriteSellers] = useState<FavoriteSeller[]>([
    {
      id: 'seller-1',
      name: 'African Delicacies',
      image: '/assets/sellers/african-delicacies.jpg',
      description: 'Authentic Nigerian food products and ingredients',
      productCount: 45,
      rating: 4.8
    },
    {
      id: 'seller-2',
      name: 'Pure Honey Co.',
      image: '/assets/sellers/pure-honey.jpg',
      description: 'Premium quality natural honey from West Africa',
      productCount: 12,
      rating: 4.9
    },
    {
      id: 'seller-3',
      name: 'Spice Heaven',
      image: '/assets/sellers/spice-heaven.jpg',
      description: 'Authentic spices and seasonings from across Africa',
      productCount: 35,
      rating: 4.7
    }
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
  };

  const removeProduct = (productId: string) => {
    setFavoriteProducts(products => products.filter(p => p.id !== productId));
  };

  const removeSeller = (sellerId: string) => {
    setFavoriteSellers(sellers => sellers.filter(s => s.id !== sellerId));
  };

  // Filter products by search query
  const filteredProducts = searchQuery
    ? favoriteProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sellerName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : favoriteProducts;

  // Filter sellers by search query
  const filteredSellers = searchQuery
    ? favoriteSellers.filter(seller => 
        seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : favoriteSellers;

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-1 -ml-4" 
          onClick={() => navigate('/account')}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Account
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Favorites</h1>
            <p className="text-muted-foreground mt-1">
              Products and sellers you've saved
            </p>
          </div>
          <form onSubmit={handleSearch} className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[300px] pr-10"
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="products" className="flex items-center gap-1.5">
              <ShoppingBag className="h-4 w-4" />
              Products ({favoriteProducts.length})
            </TabsTrigger>
            <TabsTrigger value="sellers" className="flex items-center gap-1.5">
              <Store className="h-4 w-4" />
              Sellers ({favoriteSellers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-0">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={product.image || '/assets/placeholder.png'} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full h-8 w-8"
                        onClick={() => removeProduct(product.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <Link 
                        to={`/product/${product.id}`} 
                        className="font-medium hover:text-primary block truncate"
                      >
                        {product.name}
                      </Link>
                      <Link 
                        to={`/seller/${product.sellerId}`} 
                        className="text-sm text-muted-foreground hover:text-primary mt-1 block"
                      >
                        {product.sellerName}
                      </Link>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-semibold">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.discount && (
                          <Badge variant="secondary" className="font-normal">
                            {product.discount}% off
                          </Badge>
                        )}
                      </div>
                      <div className="mt-3">
                        {product.inStock ? (
                          <Button className="w-full" asChild>
                            <Link to={`/product/${product.id}`}>
                              View Product
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full">
                            Notify When Available
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No favorite products yet</h3>
                  {searchQuery ? (
                    <p className="text-center text-muted-foreground mb-4">
                      No products match your search. Try a different search term.
                    </p>
                  ) : (
                    <p className="text-center text-muted-foreground mb-4">
                      Add products you like to your favorites to keep track of them.
                    </p>
                  )}
                  <Button asChild>
                    <Link to="/products">Browse Products</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sellers" className="mt-0">
            {filteredSellers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSellers.map(seller => (
                  <Card key={seller.id} className="flex overflow-hidden">
                    <div className="h-32 w-32 flex-shrink-0">
                      <img 
                        src={seller.image || '/assets/placeholder.png'} 
                        alt={seller.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-4 relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full h-8 w-8"
                        onClick={() => removeSeller(seller.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Link 
                        to={`/seller/${seller.id}`} 
                        className="font-medium text-lg hover:text-primary block"
                      >
                        {seller.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {seller.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Store className="h-3.5 w-3.5" />
                          <span>{seller.productCount} products</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">
                            {seller.rating.toFixed(1)}
                          </span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(seller.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : i < seller.rating
                                    ? 'text-yellow-400 fill-current opacity-50'
                                    : 'text-gray-300 fill-current'
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="w-full" asChild>
                          <Link to={`/seller/${seller.id}`}>
                            Visit Shop
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Store className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No favorite sellers yet</h3>
                  {searchQuery ? (
                    <p className="text-center text-muted-foreground mb-4">
                      No sellers match your search. Try a different search term.
                    </p>
                  ) : (
                    <p className="text-center text-muted-foreground mb-4">
                      Follow sellers you like to stay updated with their products.
                    </p>
                  )}
                  <Button asChild>
                    <Link to="/sellers">Browse Sellers</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FavoritesPage;