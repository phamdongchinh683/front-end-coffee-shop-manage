import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ReservationList from '../../components/ReservationList';
import Table from '../../components/Table';
import { getReservations, getReservationsByUser, updateReservation } from '../../services/reservationService';
import './ReservationPage.css';

export default function ReservationPage() {
 const [page, setPage] = useState(1);
 const [size, setSize] = useState(10);
 const [totalElement, setTotalElement] = useState(0);
 const [reservations, setReservations] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [selectedReservation, setSelectedReservation] = useState(null);
 const [showEditModal, setShowEditModal] = useState(false);

 let decoded;

 const getUserRole = () => {
  try {
   const token = localStorage.getItem('token');
   if (token) {
    decoded = jwtDecode(token);
    return decoded.role;
   }
   return null;
  } catch (error) {
   console.error('Error decoding token:', error);
   return null;
  }
 };

 const userRole = getUserRole();
 const isAdmin = userRole === 'ADMIN';

 useEffect(() => {
  const socket = io(import.meta.env.VITE_SOCKET_URL, {
   transports: ["websocket"]
  });

  socket.on("updateReservation", (message) => {
   console.log(message)
   try {
    const data = JSON.parse(message);
    setReservations(prev => {
     const existingIndex = prev.findIndex(r => r.id === data.reservationId);
     if (existingIndex >= 0) {
      const updated = [...prev];
      updated[existingIndex] = { ...updated[existingIndex], ...data };
      return updated;
     } else {
      return [data, ...prev];
     }
    });
   } catch (error) {
    console.error('Error parsing reservation update:', error);
   }
  });
 }, []);

 const loadReservations = async () => {
  setLoading(true);
  setError(null);
  try {
   const response = isAdmin ? await getReservations(page, size) : await getReservationsByUser(decoded.id, page, size);
   setReservations(response.data.data.results || []);
   setTotalElement(response.data.data.totalElements || 0);
   setPage(response.data.data.page || 1);
   setSize(response.data.data.size || 10);
  } catch (error) {
   setError('Failed to load reservations. Please try again.');
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  loadReservations();
 }, [page, size]);

 const handleEditReservation = (reservation) => {
  setSelectedReservation(reservation);
  setShowEditModal(true);
 };


 const handleUpdateReservation = async (updatedData) => {
  try {
   await updateReservation(selectedReservation.id);
   setReservations(prev =>
    prev.map(r => r.id === selectedReservation.id ? { ...r, ...updatedData } : r)
   );
   setShowEditModal(false);
   setSelectedReservation(null);
   alert('Reservation updated successfully!');
  } catch (error) {
   console.error('Error updating reservation:', error);
   alert('Failed to update reservation. Please try again.');
  }
 };

 const getStatusSummary = () => {
  const statusCounts = reservations.reduce((acc, reservation) => {
   acc[reservation.status] = (acc[reservation.status] || 0) + 1;
   return acc;
  }, {});

  return (
   <>
    <span className="summary-item">
     Total: {totalElement}
    </span>
    {Object.entries(statusCounts).map(([status, count]) => (
     <span key={status} className={`summary-item status-${status.toLowerCase()}`}>
      {status}: {count}
     </span>
    ))}
   </>
  );
 };

 const tableProps = {
  title: 'Reservations',
  tableList: (
   <ReservationList
    reservations={reservations}
    onEditReservation={isAdmin ? handleEditReservation : null}
   />
  ),
  size: size,
  statusData: getStatusSummary(),
  page: page,
  totalElement: totalElement,
  onSizeChange: setSize,
  onPageChange: setPage
 };

 if (loading) {
  return (
   <div className="reservation-page">
    <div className="loading-container">
     <div className="loading-spinner"></div>
     <p>Loading reservations...</p>
    </div>
   </div>
  );
 }

 return (
  <div className="reservation-page">
   {error && (
    <div className="error-banner">
     <p>{error}</p>
     <button onClick={loadReservations} className="btn btn-outline">
      Retry
     </button>
    </div>
   )}

   <Table {...tableProps} />

   {showEditModal && selectedReservation && (
    <div className="modal-overlay">
     <div className="modal-content">
      <h3>Edit Reservation</h3>
      <p>Reservation ID: {selectedReservation.id}</p>
      <p>Table: {selectedReservation.tableNumber}</p>
      <p>Guests: {selectedReservation.numberOfGuests}</p>
      <p>Time: {new Date(selectedReservation.reservationTime).toLocaleString()}</p>
      <div className="modal-actions">
       <button
        onClick={() => setShowEditModal(false)}
        className="btn btn-secondary"
       >
        Close
       </button>
       <button
        onClick={() => handleUpdateReservation({ status: 'CONFIRMED' })}
        className="btn btn-primary"
       >
        Confirm
       </button>
      </div>
     </div>
    </div>
   )}
  </div>
 );
}