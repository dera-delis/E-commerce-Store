import React, { useState, useEffect } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Mock data for now
      setProducts([
        {
          id: 1,
          name: "Sample Product",
          price: 99.99,
          category: "Electronics",
          stock: 10,
          status: "active"
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    alert('Add Product feature coming soon!');
  };

  const handleEditProduct = (productId) => {
    alert(`Edit product ${productId} feature coming soon!`);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm(`Are you sure you want to delete product ${productId}?`)) {
      alert(`Delete product ${productId} feature coming soon!`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
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
          <h3 className="text-lg leading-6 font-medium text-gray-900">Products List</h3>
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
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">P</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-900">${product.price}</div>
                    <div className="text-sm text-gray-500">Stock: {product.stock}</div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product.id)}
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
    </div>
  );
};

export default AdminProducts;
