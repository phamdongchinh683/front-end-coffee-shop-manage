import PropTypes from 'prop-types';
import React, { useState } from 'react';
import './table.css';
const Table = ({ tables = [], onTableSelect, size, page, onSizeChange, onPageChange, totalElement }) => {
 const [selectedTable, setSelectedTable] = useState(null);

 const handleTableClick = (table) => {
  if (table.status === 'OCCUPIED') {
   return;
  }

  setSelectedTable(table);
  if (onTableSelect) {
   onTableSelect(table);
  }
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
  <div className="table-container">
   <div className="table-header">
    <h2 className="table-title">Tables</h2>
    <div className="table-summary">
     <span className="summary-item">
      Total: {totalElement} tables
     </span>

     <div className="summary-item page-dropdown-container">
      <label htmlFor="page-select" className="page-label">Page:</label>
      <select
       id="page-select"
       className="page-dropdown"
       value={page || 1}
       onChange={(e) => onPageChange?.(parseInt(e.target.value))}
      >
       {Array.from({ length: Math.ceil(totalElement / (size || 10)) || 1 }, (_, i) => (
        <option key={i + 1} value={i + 1}>
         {i + 1}
        </option>
       ))}
      </select>
     </div>
     <div className="summary-item size-dropdown-container">
      <label htmlFor="size-select" className="size-label">Size:</label>
      <select
       id="size-select"
       className="size-dropdown"
       value={size || 10}
       onChange={(e) => onSizeChange?.(parseInt(e.target.value))}
      >
       <option value={10}>10</option>
       <option value={20}>20</option>
       <option value={30}>30</option>
      </select>
     </div>
     <span className="summary-item">
      Available: {tables.filter(t => t.status === 'AVAILABLE').length}
     </span>
     <span className="summary-item">
      Occupied: {tables.filter(t => t.status === 'OCCUPIED').length}
     </span>
    </div>
   </div>

   <div className="tables-grid">
    {tables.map((table) => (
     <div
      key={table.id}
      className={`table-card ${selectedTable?.id === table.id ? 'selected' : ''} 
       ${table.status.toLowerCase()} ${table.status === 'OCCUPIED' ? 'disabled' : ''}`}
      onClick={() => handleTableClick(table)}
      style={{ cursor: table.status === 'OCCUPIED' ? 'not-allowed' : 'pointer' }}
     >
      <div className="table-card-header">
       <h3 className="table-number">Table #{table.tableNumber}</h3>
       <div className="table-actions">
        {getStatusBadge(table.status)}
       </div>
      </div>

      <div className="table-card-body">
       <div className="table-info">
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
     </div>
    ))}
   </div>
  </div>
 );
};

Table.propTypes = {
 tables: PropTypes.array.isRequired,
 onTableSelect: PropTypes.func,
 size: PropTypes.number,
 page: PropTypes.number,
 onSizeChange: PropTypes.func,
 onPageChange: PropTypes.func,
 totalElement: PropTypes.number,
};

export default Table;