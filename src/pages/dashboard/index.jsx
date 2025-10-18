import React, { useEffect, useState } from 'react';
import  io  from 'socket.io-client';
import Table from '../../components/table';
import { getTables } from '../../services/tableService';
export default function DashboardPage() {
 const [page, setPage] = useState(1);
 const [size, setSize] = useState(10);
 const [totalElement, setTotalElement] = useState(0);
 const [tables, setTables] = useState([]);

 useEffect(() => {
  const socket = io("http://localhost:9095", {
   transports: ["websocket"]
  });


  socket.on("connect", () => {
   console.log("✅ Connected to Socket.IO server:", socket.id);
  });

  socket.on("disconnect", () => {
   console.log("❌ Disconnected from server");
  });
  socket.on("updateTable", (message) => {
   console.log("//////////////////////////");
   console.log("📩 Message from server:", message);
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

 return (
  <div>
   <h1>Coffee Shop Dashboard</h1>
   <Table
    tables={tables}
    size={size}
    page={page}
    totalElement={totalElement}
    onSizeChange={setSize}
    onPageChange={setPage}
   />
  </div>
 );
}