import { Product, Category } from '@/types';
import { getProducts, getCategories } from './api';

/**
 * Search options for filtering products
 */
export interface SearchOptions {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';
  inStock?: boolean;
  freeShipping?: boolean;
  onSale?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Search results structure
 */
export interface SearchResults {
  products: Product[];
  totalItems: number;
  page: number;
  totalPages: number;
  categories: Category[];
  priceRange: {
    min: number;
    max: number;
  };
}

/**
 * Search for products based on given options
 */
export const searchProducts = async (options: SearchOptions = {}): Promise<SearchResults> => {
  const {
    query = '',
    categoryId,
    minPrice,
    maxPrice,
    sortBy = 'relevance',
    inStock,
    freeShipping,
    onSale,
    page = 1,
    limit = 12,
  } = options;

  try {
    // Get all products and categories
    const [allProducts, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    
    // Apply filters
    let filteredProducts = [...allProducts];

    // Filter by search query
    if (query) {
      const normalizedQuery = query.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(normalizedQuery) ||
          p.description.toLowerCase().includes(normalizedQuery)
      );
    }

    // Filter by category
    if (categoryId) {
      filteredProducts = filteredProducts.filter((p) => 
        p.categoryIds.includes(categoryId)
      );
    }

    // Filter by price range
    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => (p.discountPrice || p.price) >= minPrice
      );
    }
    
    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => (p.discountPrice || p.price) <= maxPrice
      );
    }

    // Filter by stock availability
    if (inStock) {
      filteredProducts = filteredProducts.filter((p) => p.inventoryCount > 0);
    }

    // Filter by free shipping
    if (freeShipping) {
      // For this example, assume products with shippingClass === 'free' have free shipping
      filteredProducts = filteredProducts.filter((p) => p.shippingClass === 'free');
    }

    // Filter by sale items
    if (onSale) {
      filteredProducts = filteredProducts.filter((p) => p.discountPrice !== undefined);
    }

    // Sort products
    switch (sortBy) {
      case 'price_low':
        filteredProducts.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceA - priceB;
        });
        break;
      case 'price_high':
        filteredProducts.sort((a, b) => {
          const priceA = a.discountPrice || a.price;
          const priceB = b.discountPrice || b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filteredProducts.sort((a, b) => {
          const ratingA = a.averageRating || 0;
          const ratingB = b.averageRating || 0;
          return ratingB - ratingA;
        });
        break;
      case 'newest':
        filteredProducts.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
        break;
      case 'relevance':
      default:
        // For relevance, if there's a search query, higher matches appear first
        if (query) {
          const normalizedQuery = query.toLowerCase();
          filteredProducts.sort((a, b) => {
            // Check if the name starts with the query
            const aStartsWithQuery = a.name.toLowerCase().startsWith(normalizedQuery);
            const bStartsWithQuery = b.name.toLowerCase().startsWith(normalizedQuery);
            
            if (aStartsWithQuery && !bStartsWithQuery) return -1;
            if (!aStartsWithQuery && bStartsWithQuery) return 1;
            
            // Check exact word matches
            const aExactMatch = a.name.toLowerCase().split(' ').includes(normalizedQuery);
            const bExactMatch = b.name.toLowerCase().split(' ').includes(normalizedQuery);
            
            if (aExactMatch && !bExactMatch) return -1;
            if (!aExactMatch && bExactMatch) return 1;
            
            // Fall back to rating
            return (b.averageRating || 0) - (a.averageRating || 0);
          });
        }
        break;
    }

    // Calculate price range for all products (for filters)
    const allPrices = allProducts.map((p) => p.discountPrice || p.price);
    const priceRange = {
      min: Math.floor(Math.min(...allPrices)),
      max: Math.ceil(Math.max(...allPrices)),
    };

    // Paginate results
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      totalItems,
      page,
      totalPages,
      categories,
      priceRange,
    };
  } catch (error) {
    console.error('Error searching products:', error);
    return {
      products: [],
      totalItems: 0,
      page: 1,
      totalPages: 0,
      categories: [],
      priceRange: { min: 0, max: 1000 },
    };
  }
};