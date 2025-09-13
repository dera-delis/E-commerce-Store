import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Check if product is favorited on component mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorited(favorites.includes(product.id));
  }, [product.id]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;
    
    if (isFavorited) {
      // Remove from favorites
      newFavorites = favorites.filter(id => id !== product.id);
    } else {
      // Add to favorites
      newFavorites = [...favorites, product.id];
    }
    
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    console.log('Saved favorites to localStorage:', newFavorites);
    setIsFavorited(!isFavorited);
    
    // Dispatch custom event to update header count in real-time
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
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

  return (
    <div className="product-card group">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {/* Wishlist Button - Only show when logged in */}
        {isAuthenticated && (
          <button 
            onClick={handleToggleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full shadow-soft opacity-0 group-hover:opacity-100 transition-all duration-200 ${
              isFavorited 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-white hover:bg-gray-50'
            }`}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              size={16} 
              className={`${
                isFavorited 
                  ? 'text-white fill-current' 
                  : 'text-gray-600'
              }`} 
            />
          </button>
        )}
        
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
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-medium'
          }`}
        >
          {isAdding ? (
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
  );
};

export default ProductCard;



