import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import './reservation.css';

export default function ReservationForm({
 tableId,
 onClose,
 onSubmit
}) {
 const [formData, setFormData] = useState({
  reservationTime: '',
  numberOfGuests: 1
 });
 const [errors, setErrors] = useState({});

 const getUserId = () => {
  try {
   const token = localStorage.getItem('token');
   if (token) {
    const decoded = jwtDecode(token);
    return decoded.id
   }
   return null;
  } catch (error) {
   console.error('Error decoding token:', error);
   return null;
  }
 };

 const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
   ...prev,
   [name]: value
  }));

  // Clear error when user starts typing
  if (errors[name]) {
   setErrors(prev => ({
    ...prev,
    [name]: ''
   }));
  }
 };

 const validateForm = () => {
  const newErrors = {};

  if (!formData.reservationTime) {
   newErrors.reservationTime = 'Reservation time is required';
  } else {
   const selectedDate = new Date(formData.reservationTime);
   const now = new Date();
   if (selectedDate <= now) {
    newErrors.reservationTime = 'Reservation time must be in the future';
   }
  }

  if (!formData.numberOfGuests || formData.numberOfGuests < 1) {
   newErrors.numberOfGuests = 'Number of guests must be at least 1';
  }

  if (formData.numberOfGuests > 20) {
   newErrors.numberOfGuests = 'Maximum 20 guests allowed';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
 };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (!validateForm()) {
   return;
  }

  const userId = getUserId();
  if (!userId) {
   alert('User not authenticated. Please login again.');
   return;
  }

  const reservationData = {
   tableId: tableId,
   userId: userId,
   reservationTime: formData.reservationTime,
   numberOfGuests: parseInt(formData.numberOfGuests)
  };

  onSubmit(reservationData);
 };

 const handleClose = () => {
  setFormData({
   reservationTime: '',
   numberOfGuests: 1
  });
  setErrors({});
  onClose();
 };

 return (
  <div className="reservation-overlay">
   <div className="reservation-modal">
    <div className="reservation-header">
     <h2>Make a Reservation</h2>
     <button
      className="close-button"
      onClick={handleClose}
      aria-label="Close"
     >
      ×
     </button>
    </div>

    <form onSubmit={handleSubmit} className="reservation-form">
     <div className="form-group">
      <label htmlFor="tableId" className="form-label">
       Table ID:
      </label>
      <input
       type="text"
       id="tableId"
       value={tableId}
       disabled
       className="form-input disabled"
      />
     </div>

     <div className="form-group">
      <label htmlFor="userId" className="form-label">
       User ID:
      </label>
      <input
       type="text"
       id="userId"
       value={getUserId() || 'Not available'}
       disabled
       className="form-input disabled"
      />
     </div>

     <div className="form-group">
      <label htmlFor="reservationTime" className="form-label">
       Reservation Time: *
      </label>
      <input
       type="datetime-local"
       id="reservationTime"
       name="reservationTime"
       value={formData.reservationTime}
       onChange={handleInputChange}
       className={`form-input ${errors.reservationTime ? 'error' : ''}`}
       min={new Date().toISOString().slice(0, 16)}
      />
      {errors.reservationTime && (
       <span className="error-message">{errors.reservationTime}</span>
      )}
     </div>

     <div className="form-group">
      <label htmlFor="numberOfGuests" className="form-label">
       Number of Guests: *
      </label>
      <input
       type="number"
       id="numberOfGuests"
       name="numberOfGuests"
       value={formData.numberOfGuests}
       onChange={handleInputChange}
       min="1"
       max="20"
       className={`form-input ${errors.numberOfGuests ? 'error' : ''}`}
      />
      {errors.numberOfGuests && (
       <span className="error-message">{errors.numberOfGuests}</span>
      )}
     </div>

     <div className="form-actions">
      <button
       type="button"
       onClick={handleClose}
       className="btn btn-secondary"
      >
       Cancel
      </button>
      <button
       type="submit"
       className="btn btn-primary"
      >
       Make Reservation
      </button>
     </div>
    </form>
   </div>
  </div>
 );
}

ReservationForm.propTypes = {
 tableId: PropTypes.string.isRequired,
 onClose: PropTypes.func.isRequired,
 onSubmit: PropTypes.func.isRequired,
};
