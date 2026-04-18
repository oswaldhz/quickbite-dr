import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const MenuManagementPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    available: true,
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchRestaurantAndMenu();
    fetchCategories();
  }, [restaurantId]);

  const fetchRestaurantAndMenu = async () => {
    try {
      const [restaurantData, menuData] = await Promise.all([
        api.get(`/restaurants/${restaurantId}`),
        api.get(`/menu-items/restaurant/${restaurantId}`)
      ]);
      setRestaurant(restaurantData);
      setMenuItems(Array.isArray(menuData) ? menuData : []);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Uncomment if you have a categories endpoint
      // const data = await api.get('/categories');
      // setCategories(data);
    } catch (error) {
      // Silent fail
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        restaurantId: parseInt(restaurantId)
      };
      if (editingItem) {
        await api.put(`/menu-items/${editingItem.id}`, payload);
        toast.success('Menu item updated');
      } else {
        await api.post('/menu-items', payload);
        toast.success('Menu item added');
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: '', imageUrl: '', available: true, categoryId: '' });
      fetchRestaurantAndMenu();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await api.delete(`/menu-items/${itemId}`);
      toast.success('Menu item deleted');
      fetchRestaurantAndMenu();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      imageUrl: item.imageUrl || '',
      available: item.available,
      categoryId: item.categoryId || ''
    });
    setShowForm(true);
  };

  if (loading) return <LoadingScreen />;
  if (!restaurant) return <div className="text-center py-12">Restaurant not found</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{restaurant.name} - Menu Management</h1>
          <p className="text-gray-600">{restaurant.cuisineType} • {restaurant.address}</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Item
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{editingItem ? 'Edit' : 'Add'} Menu Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Item Name"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <input
              type="url"
              placeholder="Image URL (optional)"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              />
              Available
            </label>
            {categories.length > 0 && (
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">
                {editingItem ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {menuItems.length === 0 ? (
        <p className="text-gray-500">No menu items yet. Add your first item!</p>
      ) : (
        <div className="space-y-3">
          {menuItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <p className="text-orange-600 font-bold">${item.price}</p>
                  <span className={`text-sm ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="p-2 hover:bg-gray-100 rounded">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-100 text-red-600 rounded">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;