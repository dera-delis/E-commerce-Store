import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { api, endpoints } from '../api/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      console.log('🏠 Loading home data...');
      console.log('📡 Making API requests to:', endpoints.products.featured, 'and', endpoints.products.categories);
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.get(endpoints.products.featured),
        api.get(endpoints.products.categories)
      ]);
      
      console.log('✅ Home data loaded:', { products: productsResponse.data, categories: categoriesResponse.data });
      setFeaturedProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('❌ Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const heroCategories = [
    { name: 'Electronics', icon: '📱', color: 'bg-blue-500' },
    { name: 'Fashion', icon: '👕', color: 'bg-pink-500' },
    { name: 'Home & Garden', icon: '🏠', color: 'bg-green-500' },
    { name: 'Sports', icon: '⚽', color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Discover Amazing
                <span className="block text-primary-200">Products</span>
              </h1>
              <p className="text-xl text-primary-100 max-w-lg">
                Shop the latest trends with our curated collection of high-quality products. 
                Fast shipping, great prices, and exceptional service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="btn-accent text-lg px-8 py-3 inline-flex items-center space-x-2"
                >
                  <span>Shop Now</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/products"
                  className="btn-secondary text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary-600"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl transform rotate-6"></div>
                <div className="relative bg-white rounded-3xl p-8 shadow-strong">
                  <div className="grid grid-cols-2 gap-4">
                    {heroCategories.map((category, index) => (
                      <div
                        key={category.name}
                        className={`${category.color} rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-transform duration-300`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="text-4xl mb-2">{category.icon}</div>
                        <div className="font-semibold">{category.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of products organized by category for easy navigation
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 text-center shadow-soft hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                    <span className="text-2xl text-primary-600">
                      {category.name === 'Electronics' ? '📱' :
                       category.name === 'Clothing' ? '👕' :
                       category.name === 'Home & Garden' ? '🏠' :
                       category.name === 'Sports' ? '⚽' : '🛍️'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Handpicked products that our customers love
              </p>
            </div>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary-800 to-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-secondary-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for quality products and exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="btn-accent text-lg px-8 py-3"
            >
              Browse Products
            </Link>
            <Link
              to="/signup"
              className="btn-secondary text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-secondary-800"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
