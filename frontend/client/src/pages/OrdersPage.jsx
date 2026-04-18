import { useState, useEffect } from 'react';
import api from '../api/axios';
import OrderStatusBadge from '../components/OrderStatusBadge';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const endpoint = user.role === 'customer' ? '/orders/me' : `/orders/restaurant/${user.restaurantId}`;
        const data = await api.get(endpoint);
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'cancelled' });
      setOrders(orders.map(o => (o.id === orderId ? { ...o, status: 'cancelled' } : o)));
      toast.success('Order cancelled');
    } catch (error) {
      // Handled by interceptor
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
      toast.success('Status updated');
    } catch (error) {
      // Handled
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-display font-bold mb-6">
        {user.role === 'customer' ? 'My Orders' : 'Restaurant Orders'}
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <img
            src="https://illustrations.popsy.co/amber/empty-box.svg"
            alt="No orders"
            className="h-32 mx-auto mb-4 opacity-50"
          />
          <p className="text-secondary-500">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-soft border border-secondary-100 overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="p-5 cursor-pointer hover:bg-secondary-50 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-lg">Order #{order.id}</p>
                      <p className="text-sm text-secondary-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    {expandedOrder === order.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-secondary-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-secondary-400" />
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  <span className="text-secondary-600">
                    Restaurant: <span className="font-medium text-secondary-900">{order.restaurant?.name}</span>
                  </span>
                  <span className="text-secondary-600">
                    Total: <span className="font-bold text-primary-600">${Number(order.total).toFixed(2)}</span>
                  </span>
                  <span className="text-secondary-600">
                    Items: {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-secondary-100 bg-secondary-50/50"
                  >
                    <div className="p-5">
                      <h4 className="font-semibold mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items?.map(item => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 border">
                              {item.menuItem?.imageUrl ? (
                                <img src={item.menuItem.imageUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.menuItem?.name}</p>
                              <p className="text-sm text-secondary-500">
                                ${Number(item.price).toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-secondary-200 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary-600">${Number(order.total).toFixed(2)}</span>
                      </div>

                      {/* Customer Cancel Button */}
                      {user.role === 'customer' && order.status === 'pending' && (
                        <div className="mt-4">
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}

                      {/* Restaurant Owner Status Update */}
                      {user.role === 'restaurant_owner' && (
                        <div className="mt-4">
                          <label className="text-sm font-medium text-secondary-700 mr-2">Update Status:</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="input-field w-auto text-sm py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;