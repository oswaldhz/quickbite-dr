import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link to="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  )
}

export default NotFoundPage