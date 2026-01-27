import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, currentUser, onEdit, onDelete, onToggleStatus }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.images || [];

  return (
    <div className="product-card">
      <div className="product-image-container">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={product.productName}
              className="product-image"
            />
            {images.length > 1 && (
              <>
                <div className="image-dots">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering card click if we add one later
                        setCurrentImageIndex(index);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="product-image-placeholder">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect width="60" height="60" rx="4" fill="#e2e8f0" />
              <path d="M30 20v20M20 30h20" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.productName}</h3>

        <div className="product-details">
          <div className="detail-item">
            <span className="detail-label">Product type -</span>
            <span className="detail-value">{product.productType}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Quantity Stock -</span>
            <span className="detail-value">{product.quantityStock}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">MRP -</span>
            <span className="detail-value">₹ {product.mrp}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Selling Price -</span>
            <span className="detail-value">₹ {product.sellingPrice}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Brand Name -</span>
            <span className="detail-value">{product.brandName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total Number of images -</span>
            <span className="detail-value">{images.length}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Exchange Eligibility -</span>
            <span className="detail-value">{product.exchangeEligibility}</span>
          </div>
        </div>

        <div className="product-actions">
          {/* Check ownership: assuming product.createdBy returns an object with _id */}
          {(currentUser && product.createdBy && (
            currentUser.role === 'admin' ||
            (currentUser.id || currentUser._id) === (product.createdBy._id || product.createdBy)
          )) && (
              <>
                <button
                  className={`btn-status ${product.status === 'published' ? 'btn-unpublish' : 'btn-publish'}`}
                  onClick={() => onToggleStatus(product)}
                >
                  {product.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button className="btn-edit" onClick={() => onEdit(product)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => onDelete(product)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 6h12M4 6l-1-2M4 6v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6M6 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
