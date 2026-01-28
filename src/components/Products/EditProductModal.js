import React, { useState, useEffect } from 'react';
import { itemService } from '../../services/itemService';
import './ProductModal.css';

const EditProductModal = ({ product, onClose, onSuccess }) => {
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

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || '',
        productType: product.productType || '',
        quantityStock: product.quantityStock || '',
        mrp: product.mrp || '',
        sellingPrice: product.sellingPrice || '',
        brandName: product.brandName || '',
        images: product.images || [],
        exchangeEligibility: product.exchangeEligibility || 'Yes',
        description: product.description || ''
      });
      // Reset any previously added image files when editing a different product
      setImageFiles([]);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };



  // RE-WRITING handling to be robust
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newFileEntries = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    // Filter out duplicates if needed, but for now just add them
    setImageFiles(prev => [...prev, ...newFileEntries]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newFileEntries.map(e => e.preview)]
    }));

    // Reset file input so same file can be selected again if removed
    e.target.value = '';
  };

  // Update removeImage to use file entries
  const removeImageFixed = (index) => {
    const imageUrl = formData.images[index];
    if (imageUrl.startsWith('blob:')) {
      setImageFiles(prev => prev.filter(entry => entry.preview !== imageUrl));
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
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
      // Combine existing URLs and new File objects
      const finalImages = formData.images.map(img => {
        if (img.startsWith('blob:')) {
          const entry = imageFiles.find(e => e.preview === img);
          return entry ? entry.file : null;
        }
        return img;
      }).filter(Boolean);

      const productData = {
        ...formData,
        images: finalImages,
        quantityStock: parseInt(formData.quantityStock),
        mrp: parseFloat(formData.mrp),
        sellingPrice: parseFloat(formData.sellingPrice)
      };

      await itemService.updateItem(product._id, productData);
      onSuccess();
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const errorMessages = err.errors.map(e => e.msg).join(', ');
        setErrors({ submit: errorMessages });
      } else {
        setErrors({ submit: err.message || 'Failed to update product' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Product</h2>
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
            />
            {errors.mrp && <span className="error-message">{errors.mrp}</span>}
          </div>

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
            />
            {errors.brandName && <span className="error-message">{errors.brandName}</span>}
          </div>

          <div className="form-group">
            <div className="upload-header">
              <label className="form-label">Upload Product Images</label>
              <label htmlFor="image-upload-edit" className="add-more-photos">
                Add More Photos
                <input
                  type="file"
                  id="image-upload-edit"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="image-preview-grid">
              {formData.images.map((image, index) => (
                <div key={index} className="image-preview-item">
                  <img src={image} alt={`Product ${index}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImageFixed(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              {/* Optional: Add empty slots visualization if needed to match EXACTLY, 
                  but "Add More Photos" covers functionality. 
                  The Figma design shows styled placeholders if empty? 
                  It shows tiny thumbnails, looks like just images.
              */}
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
            <button type="submit" className="btn-update" disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
