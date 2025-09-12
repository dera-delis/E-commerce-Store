import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAccountOpen(false);
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-medium border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              E-commerce Store
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Account Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-lg hover:bg-gray-50"
                >
                  <User size={20} />
                  <span className="hidden sm:block">{user.first_name}</span>
                  <ChevronDown size={16} />
                </button>

                {/* Account Dropdown */}
                {isAccountOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-strong border border-gray-200 py-2 z-50">
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsAccountOpen(false)}
                    >
                      My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  to="/signup"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary-600 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                to="/products"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                to="/orders"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                My Orders
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;



