import PropTypes from "prop-types";
import { useState } from "react";
import { createReservation } from "../../../services/reservationService";
import ReservationForm from "../../reversation";

export default function TableList({
      tables,
      onTableSelect,
}) {

      const [selectedTable, setSelectedTable] = useState(null);
      const [showReservationForm, setShowReservationForm] = useState(false);
      const [reservationTableId, setReservationTableId] = useState(null);

      const handleTableClick = (table) => {
            if (table.status === 'OCCUPIED') {
                  return;
            }

            setSelectedTable(table);

            if (table.status === 'AVAILABLE') {
                  setReservationTableId(table.id);
                  setShowReservationForm(true);
            }

            if (onTableSelect) {
                  onTableSelect(table);
            }
      };

      const handleReservationSubmit = async (reservationData) => {
            try {
                  console.log('Submitting reservation:', reservationData);
                  const response = await createReservation(reservationData);
                  console.log('Reservation created:', response.data);
                  alert('Reservation submitted successfully!');
                  setShowReservationForm(false);
                  setReservationTableId(null);
            } catch (error) {
                  console.error('Error creating reservation:', error);
                  alert('Failed to create reservation. Please try again.');
            }
      };

      const handleReservationClose = () => {
            setShowReservationForm(false);
            setReservationTableId(null);
      };
      const getStatusBadge = (status) => {
            switch (status) {
                  case 'AVAILABLE':
                        return <span className="status-badge status-available">Available</span>;
                  case 'OCCUPIED':
                        return <span className="status-badge status-occupied">Occupied</span>;
                  case 'RESERVED':
                        return <span className="status-badge status-reserved">Reserved</span>;
                  case 'MAINTENANCE':
                        return <span className="status-badge status-maintenance">Maintenance</span>;
                  default:
                        return <span className="status-badge status-available">Available</span>;
            }
      };

      const getPaymentBadge = (paymentStatus) => {
            switch (paymentStatus) {
                  case 'PENDING':
                        return <span className="payment-badge payment-pending">Pending</span>;
                  case 'PAID':
                        return <span className="payment-badge payment-paid">Paid</span>;
                  case 'PARTIAL':
                        return <span className="payment-badge payment-partial">Partial</span>;
                  default:
                        return <span className="payment-badge payment-pending">Pending</span>;
            }
      };

      return (
            <>
                  {
                        tables.map((table) => (
                              <button
                                    key={table.id}
                                    className={`table-card ${selectedTable?.id === table.id ? 'selected' : ''} 
${table.status.toLowerCase()} ${table.status === 'OCCUPIED' ? 'disabled' : ''}`}
                                    onClick={() => handleTableClick(table)}
                                    disabled={table.status === 'OCCUPIED'}
                                    style={{ cursor: table.status === 'OCCUPIED' ? 'not-allowed' : 'pointer' }}
                              >
                                    <div className="table-card-header">
                                          <h3 className="table-card-number">Table #{table.tableNumber}</h3>
                                    </div>
                                    <div className="table-card-body">
                                          <div className="table-card-info">
                                                <div className="info-row">
                                                      <span className="info-label">Status:</span>
                                                      {getStatusBadge(table.status)}
                                                </div>
                                                <div className="info-row">
                                                      <span className="info-label">Payment:</span>
                                                      {getPaymentBadge(table.paymentStatus)}
                                                </div>
                                          </div>
                                    </div>
                              </button>
                        ))
                  }

                  {showReservationForm && (
                        <ReservationForm
                              tableId={reservationTableId}
                              onClose={handleReservationClose}
                              onSubmit={handleReservationSubmit}
                        />
                  )}
            </>
      )
}

TableList.propTypes = {
      tables: PropTypes.array.isRequired,
      onTableSelect: PropTypes.func,
};