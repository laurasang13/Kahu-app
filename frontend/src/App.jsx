import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MascotaProvider } from './context/MascotaContext'
import { ChatProvider } from './context/ChatContext'
import { useAuth } from './context/AuthContext'
import { UIProvider } from './context/UIContext'
import PesoModal from './components/PesoModal/PesoModal'

import LandingPage from './pages/Landing/LandingPage'
import LoginPage from './pages/Login/LoginPage'
import RegisterPage from './pages/Register/RegisterPage'
import HomePage from './pages/Home/HomePage'
import ChatPage from './pages/Chat/ChatPage'
import ProfilePage from './pages/Profile/ProfilePage'
import NewPetPage from './pages/NewPet/NewPetPage'
import MenusPage from './pages/MenuPage/MenusPage'
import HistorialVetPage from './pages/HistorialVet/HistorialVetPage'

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
          <ChatProvider>
            <HomePage />
          </ChatProvider>
        </PrivateRoute>
      } />
      <Route path="/chat" element={
        <PrivateRoute>
          <ChatProvider>
            <ChatPage />
          </ChatProvider>
        </PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute>
          <ProfilePage />
        </PrivateRoute>
      } />
      <Route path="/newpet" element={
        <PrivateRoute>
          <NewPetPage />
        </PrivateRoute>
      } />
      <Route path="/menus/:mascotaId" element={
        <PrivateRoute>
          <MenusPage />
        </PrivateRoute>
      } />
      <Route path="/historial/:mascotaId" element={
        <PrivateRoute>
          <HistorialVetPage />
        </PrivateRoute>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <MascotaProvider>
          <AppRoutes />
          <PesoModal />
        </MascotaProvider>
      </UIProvider>
    </AuthProvider>
  )
}