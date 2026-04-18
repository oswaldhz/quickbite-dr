import { useState, useEffect } from 'react'
import api from '../api/axios'
import LoadingScreen from '../components/LoadingScreen'

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, restaurantsData, usersData] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/restaurants'),
          api.get('/admin/users')
        ])
        setStats(statsData)
        setRestaurants(restaurantsData)
        setUsers(usersData)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleUpdateRestaurantStatus = async (id, status) => {
    try {
      await api.patch(`/restaurants/${id}/status`, { status })
      setRestaurants(restaurants.map(r => r.id === id ? { ...r, status } : r))
      toast.success('Status updated')
    } catch (error) {
      // Handled
    }
  }

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role })
      setUsers(users.map(u => u.id === userId ? { ...u, role } : u))
      toast.success('Role updated')
    } catch (error) {
      // Handled
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-orange-500 text-orange-600' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`pb-2 px-4 ${activeTab === 'restaurants' ? 'border-b-2 border-orange-500 text-orange-600' : ''}`}
        >
          Restaurants
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-orange-500 text-orange-600' : ''}`}
        >
          Users
        </button>
      </div>

      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <p className="text-gray-500">Total Restaurants</p>
            <p className="text-3xl font-bold">{stats.totalRestaurants}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-500">Total Users</p>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-500">Total Orders</p>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-500">Revenue</p>
            <p className="text-3xl font-bold">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Owner</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map(r => (
                <tr key={r.id} className="border-b">
                  <td className="px-6 py-4">{r.id}</td>
                  <td className="px-6 py-4">{r.name}</td>
                  <td className="px-6 py-4">{r.owner?.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${
                      r.status === 'approved' ? 'bg-green-100 text-green-800' :
                      r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={r.status}
                      onChange={(e) => handleUpdateRestaurantStatus(r.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approve</option>
                      <option value="suspended">Suspend</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b">
                  <td className="px-6 py-4">{u.id}</td>
                  <td className="px-6 py-4">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">{u.role}</td>
                  <td className="px-6 py-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="customer">Customer</option>
                      <option value="restaurant_owner">Restaurant Owner</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage