import React, { useState, useEffect } from 'react';
import OrderModal from '../components/OrderModal';
import { api, endpoints } from '../api/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on status
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [orders, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders from the backend API using the configured api instance
      const response = await api.get(endpoints.admin.orders.list);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Fallback to mock data if API fails
      setOrders([
        {
          id: "order_1",
          user_name: "Test User",
          user_email: "test@example.com",
          total: 89.97,
          status: "pending",
          created_at: "2024-01-15T10:30:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateOrder = async (orderId, updateData) => {
    try {
      await api.put(endpoints.admin.orders.updateStatus(orderId), updateData);
      alert('Order updated successfully!');
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error updating order:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to update order';
      throw new Error(errorMessage);
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
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <div className="flex space-x-2">
          <select 
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Orders List</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manage customer orders and fulfillment
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">O</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Order #{order.id}</div>
                      <div className="text-sm text-gray-500">{order.user_name} - {order.user_email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-900">${order.total}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {order.status}
                    </span>
                    <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdate={handleUpdateOrder}
      />
    </div>
  );
};

export default AdminOrders;
