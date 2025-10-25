import { format } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Order from '../Order';
import './ReservationList.css';

export default function ReservationList({
 reservations,
 onEditReservation,
}) {
 const [showOrderModal, setShowOrderModal] = useState(false);
 const [selectedReservationForOrder, setSelectedReservationForOrder] = useState(null);

 const token = localStorage.getItem('token');
 const decoded = jwtDecode(token);
 const isGuest = decoded.role === 'GUEST';
 const getStatusBadge = (status) => {
  switch (status) {
   case 'PENDING':
    return <span className="reservation-status status-pending">Pending</span>;
   case 'CONFIRMED':
    return <span className="reservation-status status-confirmed">Confirmed</span>;
   case 'CANCELLED':
    return <span className="reservation-status status-cancelled">Cancelled</span>;
   case 'COMPLETED':
    return <span className="reservation-status status-completed">Completed</span>;
   case 'NO_SHOW':
    return <span className="reservation-status status-no-show">No Show</span>;
   default:
    return <span className="reservation-status status-pending">Pending</span>;
  }
 };

 const formatDateTime = (dateTimeString) => {
  try {
   const date = new Date(dateTimeString);
   return format(date, 'MMM dd, yyyy - HH:mm');
  } catch {
   return dateTimeString;
  }
 };

 const handleEdit = (reservation) => {
  if (onEditReservation) {
   onEditReservation(reservation);
  }
 };

 const handleCreateOrder = (reservation) => {
  setSelectedReservationForOrder(reservation);
  setShowOrderModal(true);
 };


 return (
  <>
   {reservations.length === 0 ? (
    <div className="no-reservations">
     <div className="no-reservations-icon">📅</div>
     <h3>No Reservations Found</h3>
     <p>There are no reservations to display at the moment.</p>
    </div>
   ) : (
    reservations.map((reservation) => (
     <div key={reservation.id} className="reservation-card">
      <div className="reservation-card-header">
       <div className="reservation-info">
        <h3 className="reservation-id">Reservation #{reservation.id.slice(-8)}</h3>
        <div className="reservation-meta">
         <span className="reservation-date">
          {formatDateTime(reservation.reservationTime)}
         </span>
         {getStatusBadge(reservation.status)}
        </div>
       </div>
       <div className="reservation-actions">
        {!isGuest && (
         <button
          className="btn btn-sm btn-outline"
          onClick={() => handleEdit(reservation)}
          title="Config Reservation"
         >
          ✅
         </button>
        )}
        {isGuest && reservation.status === 'CONFIRMED' && (
         <button
          className="btn btn-sm btn-primary"
          onClick={() => handleCreateOrder(reservation)}
          title="Create Order"
         >
          Order
         </button>
        )}
       </div>
      </div>

      <div className="reservation-card-body">
       <div className="reservation-details">
        <div className="detail-row">
         <span className="detail-label">Table:</span>
         <span className="detail-value">Table #{reservation.tableNumber || 'N/A'}</span>
        </div>
        <div className="detail-row">
         <span className="detail-label">Guests:</span>
         <span className="detail-value">{reservation.numberOfGuests} people</span>
        </div>
        <div className="detail-row">
         <span className="detail-label">Customer:</span>
         <span className="detail-value">{reservation.userFullName || 'N/A'}</span>
        </div>
        <div className="detail-row">
         <span className="detail-label">Phone:</span>
         <span className="detail-value">{reservation.userPhoneNumber || 'N/A'}</span>
        </div>
       </div>

       {reservation.specialRequests && (
        <div className="reservation-notes">
         <span className="notes-label">Special Requests:</span>
         <p className="notes-content">{reservation.specialRequests}</p>
        </div>
       )}
      </div>
     </div>
    ))
   )}

   {showOrderModal && selectedReservationForOrder && (
    <Order
     reservation={selectedReservationForOrder}
     onClose={() => {
      setShowOrderModal(false);
      setSelectedReservationForOrder(null);
     }}
     onOrderCreated={() => {
      // Optionally refresh data or show success message
      console.log('Order created successfully');
     }}
    />
   )}
  </>
 );
}

ReservationList.propTypes = {
 reservations: PropTypes.array.isRequired,
 onEditReservation: PropTypes.func,
};
