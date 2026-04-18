import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../api/axios';
import RestaurantCard from '../components/RestaurantCard';
import LoadingScreen from '../components/LoadingScreen';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ cuisineType: '', status: 'approved' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const params = {};
        if (filters.status) params.status = filters.status;
        const data = await api.get('/restaurants', { params });
        setRestaurants(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [filters.status]);

  useEffect(() => {
    let filtered = restaurants;
    if (filters.cuisineType) {
      filtered = filtered.filter(r => r.cuisineType === filters.cuisineType);
    }
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisineType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredRestaurants(filtered);
  }, [restaurants, filters.cuisineType, searchTerm]);

  const cuisineTypes = [...new Set(restaurants.map(r => r.cuisineType))];

  if (loading) return <LoadingScreen />;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-primary-600 to-primary-400 p-8 md:p-12 text-white">
        <div className="relative z-10 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-display font-bold mb-4"
          >
            Delicious food,<br />delivered to your door
          </motion.h1>
          <p className="text-white/90 text-lg mb-6">
            Order from the best restaurants in Santo Domingo
          </p>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
            <input
              type="text"
              placeholder="Search restaurants or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-secondary-900 placeholder:text-secondary-400 shadow-medium focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20" />
        <div className="absolute right-10 bottom-0 w-32 h-32 bg-white/10 rounded-full -mb-10" />
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-display font-bold text-secondary-900">Restaurants</h2>
          <span className="text-secondary-500">({filteredRestaurants.length})</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            Filters
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-secondary-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Cuisine Type</label>
                  <select
                    value={filters.cuisineType}
                    onChange={(e) => setFilters({ ...filters, cuisineType: e.target.value })}
                    className="input-field"
                  >
                    <option value="">All Cuisines</option>
                    {cuisineTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="input-field"
                  >
                    <option value="approved">Approved Only</option>
                    <option value="">All Status</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restaurant Grid */}
      {filteredRestaurants.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <img
            src="https://illustrations.popsy.co/amber/restaurant.svg"
            alt="No restaurants"
            className="h-48 mx-auto mb-6"
          />
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">No restaurants found</h3>
          <p className="text-secondary-500">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <RestaurantCard restaurant={restaurant} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;