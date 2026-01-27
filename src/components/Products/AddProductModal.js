import React, { useState } from 'react';
import { itemService } from '../../services/itemService';
import './ProductModal.css';

const AddProductModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    quantityStock: '',
    mrp: '',
    sellingPrice: '',
    brandName: '',
    images: [],
    exchangeEligibility: 'Yes',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = [...imageFiles, ...files].slice(0, 10); // Max 10 images
    setImageFiles(newFiles);

    // Convert to base64 for preview (in real app, upload to server)
    const newImages = newFiles.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const removeImage = (index) => {
    // Determine if we are removing a new file or an existing one (though for Add it's all new)
    // For AddProductModal, we can just keep them in sync
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newImages = formData.images.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Please enter product name';
    }
    if (!formData.productType) {
      newErrors.productType = 'Please select product type';
    }
    if (!formData.quantityStock || formData.quantityStock <= 0) {
      newErrors.quantityStock = 'Please enter valid quantity stock';
    }
    if (!formData.mrp || formData.mrp <= 0) {
      newErrors.mrp = 'Please enter valid MRP';
    }
    if (!formData.sellingPrice || formData.sellingPrice <= 0) {
      newErrors.sellingPrice = 'Please enter valid selling price';
    }
    if (!formData.brandName.trim()) {
      newErrors.brandName = 'Please enter brand name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const productData = {
        ...formData,
        images: imageFiles, // Send actual File objects
        quantityStock: parseInt(formData.quantityStock),
        mrp: parseFloat(formData.mrp),
        sellingPrice: parseFloat(formData.sellingPrice),
        status: 'unpublished'
      };

      await itemService.createItem(productData);
      onSuccess();
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessages = err.errors.map(e => e.msg).join(', ');
        setErrors({ submit: errorMessages });
      } else {
        setErrors({ submit: err.message || 'Failed to create product' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Product</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {errors.submit && <div className="form-error">{errors.submit}</div>}

          <div className="form-group">
            <label htmlFor="productName" className="form-label">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className={`form-input ${errors.productName ? 'input-error' : ''}`}
              placeholder="Enter product name"
            />
            {errors.productName && <span className="error-message">{errors.productName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="productType" className="form-label">
              Product Type
            </label>
            <select
              id="productType"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className={`form-input ${errors.productType ? 'input-error' : ''}`}
            >
              <option value="">Select product type</option>
              <option value="Foods">Foods</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothes">Clothes</option>
              <option value="Beauty Products">Beauty Products</option>
              <option value="Others">Others</option>
            </select>
            {errors.productType && <span className="error-message">{errors.productType}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantityStock" className="form-label">
                Quantity Stock
              </label>
              <input
                type="number"
                id="quantityStock"
                name="quantityStock"
                value={formData.quantityStock}
                onChange={handleChange}
                className={`form-input ${errors.quantityStock ? 'input-error' : ''}`}
                placeholder="Total numbers of Stock available"
              />
              {errors.quantityStock && <span className="error-message">{errors.quantityStock}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="mrp" className="form-label">MRP</label>
              <input
                type="number"
                id="mrp"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                className={`form-input ${errors.mrp ? 'input-error' : ''}`}
                placeholder="Total numbers of Stock available"
              />
              {errors.mrp && <span className="error-message">{errors.mrp}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sellingPrice" className="form-label">
                Selling Price
              </label>
              <input
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                className={`form-input ${errors.sellingPrice ? 'input-error' : ''}`}
                placeholder="Total numbers of Stock available"
              />
              {errors.sellingPrice && <span className="error-message">{errors.sellingPrice}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="brandName" className="form-label">Brand Name</label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                className={`form-input ${errors.brandName ? 'input-error' : ''}`}
                placeholder="Total numbers of Stock available"
              />
              {errors.brandName && <span className="error-message">{errors.brandName}</span>}
            </div>
          </div>

          <div className="form-group">
            <div className="upload-header">
              <label className="form-label">Upload Product Images</label>
              {formData.images.length > 0 && (
                <label htmlFor="image-upload" className="add-more-photos">
                  Add More Photos
                  <input
                    type="file"
                    id="image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>

            <div className="image-upload-area">
              {formData.images.length > 0 ? (
                <div className="image-preview-grid">
                  {formData.images.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={image} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="image-upload-placeholder">
                  <div className="image-placeholder-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div className="placeholder-text-group">
                    <span className="placeholder-main">Enter Description</span>
                    <label htmlFor="image-upload-init" className="browse-link">
                      Browse
                      <input
                        type="file"
                        id="image-upload-init"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="exchangeEligibility" className="form-label">
              Exchange or return eligibility
            </label>
            <select
              id="exchangeEligibility"
              name="exchangeEligibility"
              value={formData.exchangeEligibility}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-create" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
