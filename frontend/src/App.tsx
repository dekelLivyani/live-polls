import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import CreatePollPage from './pages/CreatePollPage'
import PollCreatedPage from './pages/PollCreatedPage'
import VotePage from './pages/VotePage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create" element={<CreatePollPage />} />
          <Route path="/polls/:id/created" element={<PollCreatedPage />} />
          <Route path="/polls/:id" element={<VotePage />} />
          {/* default → register */}
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
