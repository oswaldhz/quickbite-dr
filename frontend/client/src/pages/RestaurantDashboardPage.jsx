import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Link } from 'react-router-dom'
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline'
import LoadingScreen from '../components/LoadingScreen'

const RestaurantDashboardPage = () => {
  const { user } = useAuth()
  const [myRestaurants, setMyRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cuisineType: '',
    photoUrl: ''
  })

  useEffect(() => {
    fetchMyRestaurants()
  }, [])

  const fetchMyRestaurants = async () => {
    try {
      const data = await api.get('/restaurants/owner/me')
      setMyRestaurants(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRestaurant = async (e) => {
    e.preventDefault()
    try {
      await api.post('/restaurants', formData)
      toast.success('Restaurant created! Pending approval.')
      setShowForm(false)
      fetchMyRestaurants()
      setFormData({ name: '', address: '', cuisineType: '', photoUrl: '' })
    } catch (error) {
      // Handled
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add Restaurant
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Restaurant</h2>
          <form onSubmit={handleCreateRestaurant} className="space-y-4">
            <input
              type="text"
              placeholder="Restaurant Name"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Address"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cuisine Type"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={formData.cuisineType}
              onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
            />
            <input
              type="url"
              placeholder="Photo URL (optional)"
              className="w-full px-3 py-2 border rounded-md"
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Create</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {myRestaurants.length === 0 ? (
        <p className="text-gray-500">You haven't created any restaurants yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myRestaurants.map(restaurant => (
            <div key={restaurant.id} className="card p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                <span className={`px-2 py-1 text-xs rounded ${
                  restaurant.status === 'approved' ? 'bg-green-100 text-green-800' :
                  restaurant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {restaurant.status}
                </span>
              </div>
              <p className="text-gray-600">{restaurant.cuisineType}</p>
              <p className="text-gray-500 text-sm mb-4">{restaurant.address}</p>
              <div className="flex gap-2">
                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className="btn-secondary text-sm py-1 px-3"
                >
                  View
                </Link>
                <Link
                  to={`/dashboard/menu/${restaurant.id}`}
                  className="btn-primary text-sm py-1 px-3 flex items-center gap-1"
                >
                  <PencilIcon className="h-4 w-4" />
                  Manage Menu
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RestaurantDashboardPage