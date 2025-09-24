import React, { useState, useEffect } from 'react';
import ProductModal from '../components/ProductModal';
import { api, endpoints } from '../api/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products from the admin API
      const response = await api.get(endpoints.admin.products.list);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Update existing product
        await api.put(endpoints.admin.products.update(editingProduct.id), productData);
        alert('Product updated successfully!');
      } else {
        // Create new product
        await api.post(endpoints.admin.products.create, productData);
        alert('Product created successfully!');
      }
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };


  const handleDeleteProduct = async (productId) => {
    if (window.confirm(`Are you sure you want to delete product ${productId}?`)) {
      try {
        await api.delete(endpoints.admin.products.delete(productId));
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
        <button 
          onClick={handleAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
        >
          Add New Product
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Products List ({products.length} products)</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your product inventory
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                      <img 
                        src={product.image_url || 'https://via.placeholder.com/64x64?text=No+Image'} 
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {product.description?.substring(0, 100)}...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">${product.price}</div>
                      <div className="text-sm text-gray-500">Stock: {product.stock}</div>
                      {product.rating && (
                        <div className="text-xs text-gray-400">
                          ⭐ {product.rating} ({product.review_count} reviews)
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        isEdit={!!editingProduct}
      />
    </div>
  );
};

export default AdminProducts;
