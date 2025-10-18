import { Route, Routes } from 'react-router-dom'
import './App.css'
import DashboardPage from './pages/dashboard'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
function App() {

  return (
    <div className="App">
      <Routes>
        <Route index path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  )
}

export default App
