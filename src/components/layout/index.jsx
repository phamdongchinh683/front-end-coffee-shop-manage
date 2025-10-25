import { Outlet } from 'react-router-dom';
import Header from '../header';

export default function Layout() {
 return (
  <div>
   <Header />
   <main>
    <Outlet />
   </main>
   <footer>
    <p>&copy; 2025 My App</p>
   </footer>
  </div>
 )
}