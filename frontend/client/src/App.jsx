import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import RestaurantDashboardPage from './pages/RestaurantDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MenuManagementPage from './pages/MenuManagementPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<RestaurantsPage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
        <Route path="cart" element={<CartPage />} />

        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route path="orders" element={<OrdersPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['restaurant_owner']} />}>
          <Route path="dashboard" element={<RestaurantDashboardPage />} />
          <Route path="dashboard/menu/:restaurantId" element={<MenuManagementPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin" element={<AdminDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;