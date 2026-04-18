import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/solid';

const RestaurantCard = ({ restaurant }) => {
  const [imgError, setImgError] = useState(false);

  // Mock rating and delivery time (you can add these fields to backend later)
  const rating = restaurant.rating || (Math.random() * 2 + 3).toFixed(1); // 3.0-5.0
  const deliveryTime = restaurant.deliveryTime || Math.floor(Math.random() * 20 + 15); // 15-35 min

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link to={`/restaurants/${restaurant.id}`} className="card card-hover block h-full">
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              imgError
                ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
                : restaurant.photoUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'
            }
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
          {restaurant.status !== 'approved' && (
            <div className="absolute top-3 left-3">
              <span className="badge badge-warning shadow-md">
                {restaurant.status === 'pending' ? 'Pending Approval' : 'Suspended'}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-display font-semibold text-secondary-900 line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-secondary-100 px-2 py-1 rounded-lg">
              <StarIcon className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-secondary-700">{rating}</span>
            </div>
          </div>
          <p className="text-secondary-600 text-sm mb-2 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-primary-500"></span>
            {restaurant.cuisineType}
          </p>
          <div className="flex items-center justify-between text-secondary-500 text-sm">
            <span className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              {deliveryTime} min
            </span>
            <span className="flex items-center gap-1 truncate max-w-[120px]">
              <MapPinIcon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{restaurant.address.split(',')[0]}</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;