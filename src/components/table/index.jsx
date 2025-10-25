import PropTypes from 'prop-types';
import React from 'react';
import './table.css';
const Table = ({ title, tableList, statusData, size, page, onSizeChange, onPageChange, totalElement }) => {



  return (
    <div className="table-container">
      <div className="table-header">
        <h3 className="table-title">{title}</h3>
        <div className="table-summary">
          <span className="summary-item">
            Total: {totalElement}
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
          {statusData}
        </div>
      </div>

      <div className="tables-grid">
        {tableList}
      </div>
    </div>
  );
};

Table.propTypes = {
  tableList: PropTypes.node,
  title: PropTypes.string,
  statusData: PropTypes.node,
  size: PropTypes.number,
  page: PropTypes.number,
  onSizeChange: PropTypes.func,
  onPageChange: PropTypes.func,
  totalElement: PropTypes.number,
};

export default Table;