import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api, endpoints } from '../api/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.products.detail(id));
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to load product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  // Check if product is favorited on component mount
  useEffect(() => {
    if (!id || !isAuthenticated) {
      setIsFavorited(false);
      return;
    }

    const checkFavorite = async () => {
      try {
        const response = await api.get(endpoints.favorites.check(id));
        setIsFavorited(response.data.is_favorited);
      } catch (error) {
        console.error('Failed to check favorite status:', error);
        setIsFavorited(false);
      }
    };

    checkFavorite();
  }, [id, isAuthenticated]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorited) {
        // Remove from favorites
        await api.delete(endpoints.favorites.remove(id));
        setIsFavorited(false);
      } else {
        // Add to favorites
        await api.post(endpoints.favorites.add(id));
        setIsFavorited(true);
      }
      
      // Dispatch custom event to update header count in real-time
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // Optionally show error message to user
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(id, quantity);
      // Show success message or redirect to cart
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
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
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={20}
              className={`${
                i < Math.floor(rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-gray-600">({reviewCount} reviews)</span>
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="text-sm text-primary-600 font-medium mb-2">
                {product.category}
              </div>
              {renderRating(product.rating, product.review_count)}
            </div>

            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Stock:</span>
                <span className={`font-medium ${
                  product.stock > 10 ? 'text-success-600' : 
                  product.stock > 0 ? 'text-warning-600' : 'text-accent-600'
                }`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="input-field w-20"
                  >
                    {[...Array(Math.min(10, product.stock))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-1 btn-primary py-3 text-lg font-medium flex items-center justify-center space-x-2"
                  >
                    {addingToCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  {/* Favorite Button - Only show when logged in */}
                  {isAuthenticated && (
                    <button 
                      onClick={handleToggleFavorite}
                      className={`p-3 border rounded-lg transition-colors ${
                        isFavorited 
                          ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Heart 
                        size={20} 
                        className={isFavorited ? 'fill-current' : ''} 
                      />
                    </button>
                  )}
                </div>
              </div>
            )}

            {product.stock === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600 text-center">This product is currently out of stock</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
