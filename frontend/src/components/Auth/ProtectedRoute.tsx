import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)

  // Optional loading state (useful later when checking tokens from API)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-600 font-medium">Checking authentication…</p>
      </div>
    )
  }

  // If not logged in, redirect to auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />
  }

  // If authenticated, render the protected routes
  return <Outlet />
}

export default ProtectedRoute
