import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCartIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserMenuOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-soft border-b border-secondary-200'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent hover:scale-105 transition-transform"
          >
            QuickBite
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/restaurants"
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Restaurants
            </Link>
            {isAuthenticated && user.role === 'customer' && (
              <Link
                to="/orders"
                className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
              >
                My Orders
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-secondary-100 rounded-full transition-colors"
            >
              <ShoppingCartIcon className="h-6 w-6 text-secondary-700" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 hover:bg-secondary-100 rounded-full transition-colors"
                >
                  <UserCircleIcon className="h-8 w-8 text-primary-500" />
                  <span className="hidden lg:inline text-sm font-medium text-secondary-700">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-hard border border-secondary-200 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-secondary-100">
                        <p className="text-sm font-semibold text-secondary-900">{user.name}</p>
                        <p className="text-xs text-secondary-500">{user.email}</p>
                      </div>
                      <div className="py-1">
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          >
                            Admin Dashboard
                          </Link>
                        )}
                        {user.role === 'restaurant_owner' && (
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          >
                            Restaurant Dashboard
                          </Link>
                        )}
                        {user.role === 'customer' && (
                          <Link
                            to="/orders"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          >
                            My Orders
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-secondary hidden sm:inline-block">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary-100 rounded-full"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-secondary-200"
            >
              <div className="py-4 space-y-2">
                <Link
                  to="/restaurants"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
                >
                  Restaurants
                </Link>
                {isAuthenticated && user.role === 'customer' && (
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
                  >
                    My Orders
                  </Link>
                )}
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-secondary-700 hover:bg-secondary-50 rounded-lg"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;