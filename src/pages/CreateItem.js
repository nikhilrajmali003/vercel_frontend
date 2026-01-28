import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import Input from '../components/UI/Input';
import Textarea from '../components/UI/Textarea';
import Button from '../components/UI/Button';
import Error from '../components/UI/Error';
import './Form.css';

const CreateItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    images: [], // Can be file objects or URLs
    imageInput: '', // Temporary input for URL
    productType: '',
    sellingPrice: '',
    mrp: '',
    quantityStock: '',
    brandName: '',
    exchangeEligibility: 'No',
    status: 'unpublished'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = ['productName', 'productType', 'sellingPrice', 'mrp', 'quantityStock', 'brandName'];
      const missing = requiredFields.filter(field => !formData[field]);
      if (missing.length > 0) {
        throw new Error(`Missing required fields: ${missing.join(', ')}`);
      }

      const itemData = {
        productName: formData.productName,
        productType: formData.productType,
        quantityStock: parseInt(formData.quantityStock),
        mrp: parseFloat(formData.mrp),
        sellingPrice: parseFloat(formData.sellingPrice),
        brandName: formData.brandName,
        exchangeEligibility: formData.exchangeEligibility,
        description: formData.description,
        status: formData.status,
        // Handle images: if URL input exists, use it. Backend expects array.
        images: formData.imageInput ? [formData.imageInput] : []
      };

      await itemService.createItem(itemData);
      navigate('/products'); // Redirect to products list
    } catch (err) {
      setError(err.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h1>Create New Product</h1>
      <form onSubmit={addItem} className="form">
        {error && <Error message={error} />}

        <Input
          label="Product Name"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="productType" className="input-label">
              Product Type
            </label>
            <select
              id="productType"
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="">Select Type</option>
              <option value="Foods">Foods</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothes">Clothes</option>
              <option value="Beauty Products">Beauty Products</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <Input
            label="Brand Name"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <Input
            label="MRP"
            name="mrp"
            type="number"
            value={formData.mrp}
            onChange={handleChange}
            placeholder="0.00"
            required
            min="0"
          />
          <Input
            label="Selling Price"
            name="sellingPrice"
            type="number"
            value={formData.sellingPrice}
            onChange={handleChange}
            placeholder="0.00"
            required
            min="0"
          />
        </div>

        <div className="form-row">
          <Input
            label="Quantity Stock"
            name="quantityStock"
            type="number"
            value={formData.quantityStock}
            onChange={handleChange}
            required
            min="0"
          />
          <div className="form-group">
            <label htmlFor="exchangeEligibility" className="input-label">
              Exchange Eligibility
            </label>
            <select
              id="exchangeEligibility"
              name="exchangeEligibility"
              value={formData.exchangeEligibility}
              onChange={handleChange}
              className="input-field"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
        />

        <Input
          label="Image URL"
          name="imageInput"
          type="url"
          value={formData.imageInput}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />

        <div className="form-group">
          <label htmlFor="status" className="input-label">
            Initial Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="unpublished">Unpublished</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/products')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateItem;
