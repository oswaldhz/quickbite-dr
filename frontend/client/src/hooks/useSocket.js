import { useEffect } from 'react'
import { socket } from '../api/socket'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export const useSocket = () => {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    socket.on('connect', () => {
      console.log('Socket connected')
      // Join appropriate rooms
      socket.emit('join:user', user.id)
      if (user.role === 'restaurant_owner') {
        // You might want to join restaurant room when owner views their restaurant
      }
    })

    socket.on('order:new', (order) => {
      toast.success(`New order received! Order #${order.id}`)
    })

    socket.on('order:updated', (order) => {
      toast.success(`Order #${order.id} status updated to ${order.status}`)
    })

    return () => {
      socket.off('connect')
      socket.off('order:new')
      socket.off('order:updated')
    }
  }, [user])
}