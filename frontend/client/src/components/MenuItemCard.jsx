import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const MenuItemCard = ({ item, restaurantId }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [imgError, setImgError] = useState(false);

  const cartItem = cart.items.find(i => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    addToCart(restaurantId, item);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="card p-4 flex gap-4 items-center"
    >
      {/* Image */}
      <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-secondary-100">
        {item.imageUrl && !imgError ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-secondary-400">
            <span className="text-3xl">🍽️</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-secondary-900">{item.name}</h4>
          <span className="font-bold text-primary-600 ml-2">${item.price}</span>
        </div>
        <p className="text-secondary-500 text-sm line-clamp-2 mt-1">{item.description}</p>
        {!item.available && (
          <span className="inline-block mt-2 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
            Out of stock
          </span>
        )}
      </div>

      {/* Action */}
      {item.available && (
        <div className="flex-shrink-0">
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="btn-primary py-2 px-4 text-sm"
            >
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-secondary-100 rounded-full p-1">
              <button
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="p-1.5 rounded-full hover:bg-white transition-colors"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-6 text-center font-medium">{quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="p-1.5 rounded-full hover:bg-white transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MenuItemCard;