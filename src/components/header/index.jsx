import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

export default function Header() {
 const token = localStorage.getItem('token');
 const role = token ? jwtDecode(token).role : null;
 const navigate = useNavigate();
 const handleLogout = () => {
  localStorage.removeItem('token');
  navigate('/login');
 }
 const adminRouter = [
  {
   path: '/dashboard',
   label: 'Table',
  },
  {
   path: '/orders',
   label: 'Orders',
  },
  {
   path: '/reservations',
   label: 'Reservations',
  },
  {
   path: '/reports',
   label: 'Reports',
  },
  {
   path: '/menus',
   label: 'Menus',
  }
 ]

 const guestRouter = [
  {
   path: '/dashboard',
   label: 'Tables',
  },
  {
   path: '/my-orders',
   label: 'My orders',
  },
  {
   path: '/reservations',
   label: 'Reservations',
  }
 ]
 return (
  <header>
   <div className="header-container">
    <h1>Dashboard</h1>
    <nav>
     <ul className="container-nav-link">
      {role == "ADMIN" ? adminRouter.map((router) =>
       <li className="summary-item-nav"><Link to={router.path}>{router.label}</Link></li>
      ) : guestRouter.map((router) =>
       <li className="summary-item-nav"><Link to={router.path}>{router.label}</Link></li>
      )}
      <li className="summary-item-nav" onClick={handleLogout}>Logout</li>
     </ul>
    </nav>
   </div>
  </header>
 )
}