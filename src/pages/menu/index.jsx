import React, { useEffect, useState } from 'react';
import MenuList from '../../components/Menu/MenuList';
import Table from '../../components/Table';
import { getMenus } from '../../services/menuService';

export default function MenuPage() {
 const [menuItems, setMenuItems] = useState([]);
 const [page, setPage] = useState(1);
 const [size, setSize] = useState(10);
 const [totalElement, setTotalElement] = useState(0);

 const fetchMenuItems = async () => {
  try {
   const response = await getMenus(page, size);
   setMenuItems(response.data.data.results || []);
   setTotalElement(response.data.data.totalElements || 0);
   setPage(response.data.data.page)
   setSize(response.data.data.size)
  } catch (error) {
   console.error('Error fetching menu items:', error);
  }
 };

 useEffect(() => {
  fetchMenuItems();
 }, [page, size]);

 const handleMenuSelect = (menuItem) => {
  console.log('Selected menu item:', menuItem);
  // Add your menu selection logic here
 };

 const handlePageChange = (newPage) => {
  setPage(newPage);
 };

 const handleSizeChange = (newSize) => {
  setSize(newSize);
  setPage(1); // Reset to first page when changing size
 };

 const tableProps = {
  data: menuItems,
  size: size,
  page: page,
  statusData:
   <>
    <span className="summary-item">
     Available: {menuItems.filter(t => t.status === 'ACTIVE').length}
    </span>
    <span className="summary-item">
     Unavailable: {menuItems.filter(t => t.status === 'INACTIVE').length}
    </span>
   </>,
  onSizeChange: setSize,
  onPageChange: setPage,
  totalElement: totalElement,
  title: "Menus",
  tableList: <MenuList tables={menuItems} />,
 }

 return (
  <div className="menu-page">
   <Table
    {...tableProps}
   />
  </div>
 );
}