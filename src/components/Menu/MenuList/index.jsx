import PropTypes from "prop-types";
import { useState } from "react";
import "./MenuList.css";

export default function MenuList({ tables, onTableSelect }) {
 const [selectedTable, setSelectedTable] = useState(null);

 const handleTableClick = (table) => {
  if (table.status === "OCCUPIED" || table.status === "INACTIVE") {
   return;
  }

  setSelectedTable(table);
  if (onTableSelect) {
   onTableSelect(table);
  }
 };



 const parseMenuData = (menuItem) => {
  const costs = menuItem.costs
   ? menuItem.costs.split(",").map((c) => c.trim())
   : [];
  const sizes = menuItem.sizes
   ? menuItem.sizes.split(",").map((s) => s.trim())
   : [];

  // Zip sizes and costs together
  const pricing = sizes.map((size, index) => ({
   size,
   cost: Number(costs[index]) || 0, // ensure numeric value
  }));

  return { costs, sizes, pricing };
 };

 return (
  <>
   {tables.map((menuItem) => {
    const { pricing } = parseMenuData(menuItem);

    return (
     <div
      key={menuItem.id}
      className={`table-card ${selectedTable?.id === menuItem.id ? "selected" : ""
       } ${menuItem.status.toLowerCase()} ${menuItem.status === "INACTIVE" ? "disabled" : ""
       }`}
      onClick={() => handleTableClick(menuItem)}
      style={{
       cursor:
        menuItem.status === "INACTIVE" ? "not-allowed" : "pointer",
      }}
     >
      <div className="table-card-header">
       <h3 className="menu-name">{menuItem.menuName}</h3>
      </div>

      <div className="table-card-body">
       <div className="table-info">
        <div className="table-column-start">
         <span className="info-label">Description:</span>
         <div className="menu-description">
          {menuItem.description || "No description"}
         </div>
        </div>
       </div>

       <div className="info-row">
        <div className="menu-pricing">
         <span className="info-label">Pricing:</span>
         <div className="pricing-options">
          {pricing.length > 0 ? (
           pricing.map((item, index) => (
            <div key={index} className="pricing-row">
             <div className="size-option">
              <span className="size-label-text">{item.size}</span>
             </div>
             <div className="price-value">
              ${item.cost.toFixed(2)}
             </div>
            </div>
           ))
          ) : (
           <div className="no-pricing">No pricing data</div>
          )}
         </div>
        </div>
       </div>
      </div>
     </div>
    );
   })}
  </>
 );
}

MenuList.propTypes = {
 tables: PropTypes.array.isRequired,
 onTableSelect: PropTypes.func,
};
