import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/layout'
import ReportPage from './components/Report'
import DashboardPage from './pages/dashboard'
import LoginPage from './pages/login'
import MenuPage from './pages/menu'
import RegisterPage from './pages/register'
import ReservationPage from './pages/reservation'
function App() {

  return (
    <div className="App">
      <Routes>
        <Route index path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/menus" element={<MenuPage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/reservations" element={<ReservationPage />} />
        </Route>
      </Routes>
    </div >
  )
}

export default App
