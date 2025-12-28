import React, { useState, useEffect } from 'react';
import ProductModal from '../components/ProductModal';
import { api, endpoints } from '../api/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all products by setting a high limit (1000 should be enough for most stores)
      const response = await api.get(endpoints.admin.products.list, {
        params: {
          page: 1,
          limit: 1000  // Fetch up to 1000 products
        }
      });
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
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to save product';
      throw new Error(errorMessage);
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
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 rounded-full border-b-2 border-red-600 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button 
            onClick={fetchProducts}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md transition-colors cursor-pointer hover:bg-red-700"
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
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md transition-colors cursor-pointer hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Products List ({products.length} products)</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage your product inventory
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      {product.image_url && !failedImages.has(product.id) ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={() => {
                            setFailedImages(prev => new Set(prev).add(product.id));
                          }}
                        />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                      <div className="mt-1 text-xs text-gray-400">
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
                        className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-sm font-medium text-red-600 cursor-pointer hover:text-red-900"
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
