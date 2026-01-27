import React from 'react';
import './DeleteProductModal.css';

const DeleteProductModal = ({ product, onClose, onConfirm }) => {
  if (!product) return null;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
          <h2 className="delete-modal-title">Delete Product</h2>
          <button className="delete-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="delete-modal-body">
          <p className="delete-modal-message">
            Are you sure you really want to delete this Product "{product.productName}"?
          </p>
        </div>

        <div className="delete-modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-delete" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
