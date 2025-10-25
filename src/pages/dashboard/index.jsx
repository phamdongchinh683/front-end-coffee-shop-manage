import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Table from '../../components/Table';
import TableList from '../../components/table/components/TableList';
import { getTables } from '../../services/tableService';
export default function DashboardPage() {
 const [page, setPage] = useState(1);
 const [size, setSize] = useState(10);
 const [totalElement, setTotalElement] = useState(0);
 const [tables, setTables] = useState([]);

 useEffect(() => {
  const socket = io(import.meta.env.VITE_SOCKET_URL, {
   transports: ["websocket"]
  });

  socket.on("updateTable", (message) => {

   const data = JSON.parse(message);
   setTables((prev) => [...prev.filter(t => t.tableNumber !== data.tableNumber), data]);
  });

  return () => socket.disconnect();
 }, []);

 useEffect(() => {
  getTables(page, size).then((response) => {
   setSize(response.data.data.size)
   setPage(response.data.data.page)
   setTables(response.data.data.results);
   setTotalElement(response.data.data.totalElements)
  });
 }, [page, size]);


 const tableProps = {
  title: 'Tables',
  tableList: <TableList tables={tables} />,
  size: size,
  statusData:
   <>
    <span className="summary-item">
     Available: {tables.filter(t => t.status === 'AVAILABLE').length}
    </span>
    <span className="summary-item">
     Occupied: {tables.filter(t => t.status === 'OCCUPIED').length}
    </span>
   </>,
  page: page,
  totalElement: totalElement,
  onSizeChange: setSize,
  onPageChange: setPage
 };

 return (
  <div>
   <Table
    {...tableProps}
   />
  </div>
 );
}