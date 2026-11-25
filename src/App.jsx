import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecipeHub } from './pages/RecipeHub.jsx'
import { Signup } from './pages/Signup.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { Login } from './pages/Login.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { io } from 'socket.io-client'
import { SocketIOContextProvider } from './contexts/SocketIOContext.jsx'

const socket = io(import.meta.env.VITE_SOCKET_HOST)

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <RecipeHub />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SocketIOContextProvider>
          <RouterProvider router={router} />
        </SocketIOContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
