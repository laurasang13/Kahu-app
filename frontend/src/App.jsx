import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MascotaProvider } from './context/MascotaContext'
import { ChatProvider } from './context/ChatContext'
import { useAuth } from './context/AuthContext'

import LandingPage from './pages/Landing/LandingPage'
import LoginPage from './pages/Login/LoginPage'
import RegisterPage from './pages/Register/RegisterPage'
import HomePage from './pages/Home/HomePage'
import ChatPage from './pages/Chat/ChatPage'
import ProfilePage from './pages/Profile/ProfilePage'
import NewPetPage from './pages/NewPet/NewPetPage'

function PrivateRoute({ children }) {
  const { usuario, loading } = useAuth()
  if (loading) return null
  return usuario ? children : <Navigate to="/" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={
        <PrivateRoute>
          <MascotaProvider>
            <ChatProvider>
              <HomePage />
            </ChatProvider>
          </MascotaProvider>
        </PrivateRoute>
      } />
      <Route path="/chat" element={
        <PrivateRoute>
          <MascotaProvider>
            <ChatProvider>
              <ChatPage />
            </ChatProvider>
          </MascotaProvider>
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <MascotaProvider>
            <ProfilePage />
          </MascotaProvider>
        </PrivateRoute>
      } />
      <Route path="/newpet" element={
        <PrivateRoute>
          <MascotaProvider>
            <NewPetPage />
          </MascotaProvider>
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}