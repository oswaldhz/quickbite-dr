import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Navbar />
      <motion.main
        key={location.pathname + location.search}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8"
      >
        <Outlet />
      </motion.main>
      <footer className="bg-white border-t border-secondary-200 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-secondary-500 text-sm">
          <p>&copy; {new Date().getFullYear()} QuickBite DR. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;