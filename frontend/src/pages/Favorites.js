import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api, endpoints } from '../api/api';

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      loadFavoriteProducts();
    }
    
    // Listen for favorites updates
    const handleFavoritesUpdate = () => {
      if (isAuthenticated) {
        loadFavoriteProducts();
      }
    };
    
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, [isAuthenticated]);

  const loadFavoriteProducts = async () => {
    if (!isAuthenticated) {
      setFavoriteProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(endpoints.favorites.list);
      setFavoriteProducts(response.data || []);
    } catch (error) {
      console.error('Failed to load favorite products:', error);
      setFavoriteProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (productId) => {
    try {
      await api.delete(endpoints.favorites.remove(productId));
      setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
      
      // Dispatch custom event to update header count
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      // Optionally show error message to user
    }
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    setIsAdding(prev => ({ ...prev, [product.id]: true }));
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderRating = (rating, reviewCount) => {
    if (!rating) return null;

    return (
      <div className="flex items-center space-x-1">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${
                i < Math.floor(rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">({reviewCount})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-6">Start adding products to your favorites!</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">
            {favoriteProducts.length} favorite product{favoriteProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="product-card group">
              {/* Product Image */}
              <div className="relative overflow-hidden bg-gray-100">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
                
                {/* Remove from Favorites Button */}
                <button 
                  onClick={() => handleToggleFavorite(product.id)}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                  title="Remove from favorites"
                >
                  <Heart size={16} className="text-white fill-current" />
                </button>
                
                {/* Stock Badge */}
                {product.stock <= 10 && product.stock > 0 && (
                  <span className="absolute top-2 left-2 badge badge-warning">
                    Low Stock
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="absolute top-2 left-2 badge badge-error">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Category */}
                <div className="text-xs text-primary-600 font-medium mb-1">
                  {product.category}
                </div>

                {/* Product Name */}
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                {renderRating(product.rating, product.review_count)}

                {/* Price */}
                <div className="mt-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={isAdding[product.id] || product.stock === 0}
                  className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-medium'
                  }`}
                >
                  {isAdding[product.id] ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      <span>
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
