import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrashIcon,
  ChevronLeftIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    if (cart.restaurantId) {
      api.get(`/restaurants/${cart.restaurantId}`)
        .then(setRestaurant)
        .catch(console.error);
    } else {
      setRestaurant(null);
    }
  }, [cart.restaurantId]);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setPlacing(true);
    try {
      const orderData = {
        restaurantId: cart.restaurantId,
        items: cart.items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity
        }))
      };
      await api.post('/orders', orderData);
      toast.success('Order placed successfully! 🎉');
      clearCart();
      navigate('/orders');
    } catch (error) {
      // Handled by interceptor
    } finally {
      setPlacing(false);
    }
  };

  // Guard against undefined items (should never happen, but safe)
  const items = cart.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <img
          src="https://illustrations.popsy.co/amber/empty-cart.svg"
          alt="Empty cart"
          className="h-48 mx-auto mb-6"
        />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-secondary-500 mb-8">Add some delicious items from a restaurant!</p>
        <button onClick={() => navigate('/restaurants')} className="btn-primary">
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-secondary-500 hover:text-secondary-700 mb-6"
      >
        <ChevronLeftIcon className="h-5 w-5" />
        Back
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold mb-4">Your Cart</h1>
          {restaurant && (
            <div className="flex items-center gap-2 mb-4 text-secondary-600">
              <span>From</span>
              <span className="font-medium text-secondary-900">{restaurant.name}</span>
            </div>
          )}

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card p-4 flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-secondary-100 rounded-xl overflow-hidden flex-shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-primary-600 font-medium">${Number(item.price).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-secondary-100 rounded-full p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 rounded-full hover:bg-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 rounded-full hover:bg-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-secondary-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-secondary-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-secondary-600">
                <span>Delivery Fee</span>
                <span>$2.99</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary-600">${(totalPrice + 2.99).toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full btn-primary py-4 text-lg disabled:opacity-70"
            >
              {placing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </span>
              ) : (
                'Place Order'
              )}
            </button>
            <p className="text-xs text-secondary-400 text-center mt-4">
              By placing your order, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;