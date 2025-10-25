import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { getMenus } from '../../services/menuService';
import { createOrder, createOrderItems } from '../../services/orderService';
import './Order.css';

export default function Order({ reservation, onClose, onOrderCreated }) {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      const response = await getMenus(1, 100);
      setMenuItems(response.data.data.results || []);
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseMenuData = (menuItem) => {
    const costs = menuItem.costs ? menuItem.costs.split(",").map(c => c.trim()) : [];
    const sizes = menuItem.sizes ? menuItem.sizes.split(",").map(s => s.trim()) : [];
    const pricing = sizes.map((size, index) => ({
      size,
      cost: Number(costs[index]) || 0,
    }));
    return { pricing };
  };

  const addToOrder = (menuItem, selectedSize, quantity, customNote = '') => {
    const { pricing } = parseMenuData(menuItem);
    const price = pricing.find(p => p.size === selectedSize)?.cost || 0;
    const subtotal = parseFloat((price * quantity).toFixed(2));

    // Auto-generate note: quantity + size (e.g., "2 L")
    const autoNote = `${quantity} ${selectedSize}`;
    // Combine auto note with custom note if provided
    const finalNote = customNote ? `${autoNote}, ${customNote}` : autoNote;

    const orderItem = {
      menu: { id: menuItem.id },
      quantity,
      subtotal,
      orderNote: finalNote,
      selectedSize,
      menuName: menuItem.menuName
    };

    setSelectedItems(prev => [...prev, orderItem]);
  };

  const removeFromOrder = (index) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromOrder(index);
      return;
    }

    setSelectedItems(prev => prev.map((item, i) => {
      if (i === index) {
        const newSubtotal = parseFloat(((item.subtotal / item.quantity) * newQuantity).toFixed(2));
        // Extract custom note if exists (after the comma)
        const customNote = item.orderNote.includes(',')
          ? item.orderNote.split(',').slice(1).join(',').trim()
          : '';
        // Regenerate note with new quantity
        const autoNote = `${newQuantity} ${item.selectedSize}`;
        const finalNote = customNote ? `${autoNote}, ${customNote}` : autoNote;

        return {
          ...item,
          quantity: newQuantity,
          subtotal: newSubtotal,
          orderNote: finalNote
        };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    const total = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
    return parseFloat(total.toFixed(2));
  };

  const handleSubmitOrder = async () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item');
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Create order
      const orderData = {
        table: { id: reservation.tableId },
        user: { id: reservation.userId },
        totalAmount: calculateTotal()
      };

      const orderResponse = await createOrder(orderData);
      const orderId = orderResponse.data.data.id;

      // Step 2: Create order items
      const orderItems = selectedItems.map(item => ({
        order: { id: orderId },
        menu: { id: item.menu.id },
        quantity: item.quantity,
        subtotal: item.subtotal,
        orderNote: item.orderNote
      }));

      await createOrderItems(orderItems);

      alert('Order created successfully!');
      onOrderCreated && onOrderCreated();
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">Loading menu...</div>
    );
  }

  return (
    <div className="order-modal-overlay">
      <div className="order-modal-content">
        <div className="order-header">
          <h2>Create Order - Reservation #{reservation.id.slice(-8)}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="order-content">
          <div className="menu-section">
            <h3>Menu Items</h3>
            <div className="menu-grid">
              {menuItems.map(menuItem => {
                const { pricing } = parseMenuData(menuItem);
                return (
                  <MenuItemCard
                    key={menuItem.id}
                    menuItem={menuItem}
                    pricing={pricing}
                    onAddToOrder={addToOrder}
                  />
                );
              })}
            </div>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            {selectedItems.length === 0 ? (
              <p>No items selected</p>
            ) : (
              <div className="selected-items">
                {selectedItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.menuName}</span>
                      <span className="item-size">({item.selectedSize})</span>
                      {item.orderNote && <span className="item-note">Note: {item.orderNote}</span>}
                    </div>
                    <div className="item-controls">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                        className="quantity-input"
                      />
                      <span className="item-price">${item.subtotal.toFixed(2)}</span>
                      <button onClick={() => removeFromOrder(index)} className="remove-btn">×</button>
                    </div>
                  </div>
                ))}
                <div className="order-total">
                  <strong>Total: ${calculateTotal().toFixed(2)}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="order-actions">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button
            onClick={handleSubmitOrder}
            className="btn btn-primary"
            disabled={selectedItems.length === 0 || submitting}
          >
            {submitting ? 'Creating Order...' : 'Create Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

Order.propTypes = {
  reservation: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onOrderCreated: PropTypes.func,
};

// Menu Item Card Component
function MenuItemCard({ menuItem, pricing, onAddToOrder }) {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderNote, setOrderNote] = useState('');

  const handleAddToOrder = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    onAddToOrder(menuItem, selectedSize, quantity, orderNote);
    setQuantity(1);
    setOrderNote('');
    setSelectedSize('');
  };

  return (
    <div className="menu-item-card">
      <h4>{menuItem.menuName}</h4>
      <p>{menuItem.description}</p>

      <div className="size-selection">
        <label>Size:</label>
        <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
          <option value="">Select size</option>
          {pricing.map((item, index) => (
            <option key={index} value={item.size}>
              {item.size} - ${item.cost.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <div className="quantity-input-wrapper">
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
        />
      </div>

      <div className="order-note">
        <label>Additional Note (optional):</label>
        <input
          type="text"
          value={orderNote}
          onChange={(e) => setOrderNote(e.target.value)}
          placeholder="e.g., No sugar, Hot, Extra ice"
        />
        <small className="note-hint">Default note: {quantity} {selectedSize || '(select size)'}</small>
      </div>

      <button onClick={handleAddToOrder} className="btn btn-sm btn-primary">
        Add to Order
      </button>
    </div>
  );
}

MenuItemCard.propTypes = {
  menuItem: PropTypes.object.isRequired,
  pricing: PropTypes.array.isRequired,
  onAddToOrder: PropTypes.func.isRequired,
};

