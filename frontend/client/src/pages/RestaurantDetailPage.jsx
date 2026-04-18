import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../api/axios';
import MenuItemCard from '../components/MenuItemCard';
import LoadingScreen from '../components/LoadingScreen';
import { useCart } from '../context/CartContext';
import {
  StarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/solid';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');
  const { cart } = useCart();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await api.get(`/restaurants/${id}`);
        setRestaurant(data);
      } catch (error) {
        console.error('Failed to fetch restaurant:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (!restaurant) return <div className="text-center py-12">Restaurant not found</div>;

  const cartItemsFromThisRestaurant = cart.restaurantId === restaurant.id;
  const cartItemCount = cartItemsFromThisRestaurant
    ? cart.items.reduce((sum, i) => sum + i.quantity, 0)
    : 0;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 lg:h-96 -mt-6 md:-mt-8 mb-8 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={restaurant.photoUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-display font-bold mb-2"
          >
            {restaurant.name}
          </motion.h1>
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-400"></span>
              {restaurant.cuisineType}
            </span>
            <span className="flex items-center gap-1">
              <MapPinIcon className="h-4 w-4" />
              {restaurant.address}
            </span>
            <span className="flex items-center gap-1">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              4.5 (200+ ratings)
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              20-30 min
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200 mb-6">
        <div className="flex gap-6">
          {['menu', 'info'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-primary-600'
                  : 'text-secondary-500 hover:text-secondary-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="text-2xl font-display font-bold mb-6">Menu</h2>
            {restaurant.menuItems?.length > 0 ? (
              <div className="space-y-3">
                {restaurant.menuItems.map(item => (
                  <MenuItemCard key={item.id} item={item} restaurantId={restaurant.id} />
                ))}
              </div>
            ) : (
              <p className="text-secondary-500">No menu items available.</p>
            )}
          </motion.div>
        )}

        {activeTab === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl p-6 shadow-soft"
          >
            <h3 className="font-semibold mb-4">Restaurant Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-secondary-600">{restaurant.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClockIcon className="h-5 w-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="text-secondary-600">Mon-Sun: 10:00 AM - 10:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PhoneIcon className="h-5 w-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-secondary-600">(809) 555-0123</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GlobeAltIcon className="h-5 w-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-secondary-600">
                    www.{restaurant.name.toLowerCase().replace(/\s/g, '')}.com
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Cart Preview */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-white rounded-2xl shadow-hard border border-secondary-200 p-4 z-40"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{cartItemCount} items in cart</p>
                <p className="text-sm text-secondary-500">
                  Total: $
                  {cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}
                </p>
              </div>
              <Link to="/cart" className="btn-primary py-2 px-6">
                View Cart
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantDetailPage;