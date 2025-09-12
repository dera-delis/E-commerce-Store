import React, { useState, useEffect } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Mock data for now
      setOrders([
        {
          id: 1,
          customer: "John Doe",
          email: "john@example.com",
          total: 199.98,
          status: "pending",
          date: "2024-01-15"
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    alert(`Filter by status: ${status} - feature coming soon!`);
  };

  const handleViewOrder = (orderId) => {
    alert(`View order ${orderId} details - feature coming soon!`);
  };

  const handleUpdateOrder = (orderId) => {
    alert(`Update order ${orderId} - feature coming soon!`);
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
          {orders.map((order) => (
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
                      <div className="text-sm text-gray-500">{order.customer} - {order.email}</div>
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
                    <div className="text-sm text-gray-500">{order.date}</div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewOrder(order.id)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium cursor-pointer"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleUpdateOrder(order.id)}
                        className="text-green-600 hover:text-green-900 text-sm font-medium cursor-pointer"
                      >
                        Update
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

export default AdminOrders;
