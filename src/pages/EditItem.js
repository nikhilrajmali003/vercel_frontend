import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itemService } from '../services/itemService';
import Input from '../components/UI/Input';
import Textarea from '../components/UI/Textarea';
import Button from '../components/UI/Button';
import Loading from '../components/UI/Loading';
import Error from '../components/UI/Error';
import './Form.css';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    imageInput: '',
    productType: '',
    sellingPrice: '',
    mrp: '',
    quantityStock: '',
    brandName: '',
    exchangeEligibility: 'No',
    status: 'unpublished'
  });

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await itemService.getItemById(id);
      const item = result.data; // Ensure we access data property correctly as per controller

      setFormData({
        productName: item.productName || '',
        description: item.description || '',
        // Map images array to single URL for now, taking the first one if available
        imageInput: (item.images && item.images.length > 0) ? item.images[0] : '',
        productType: item.productType || '',
        sellingPrice: item.sellingPrice || '',
        mrp: item.mrp || '',
        quantityStock: item.quantityStock || '',
        brandName: item.brandName || '',
        exchangeEligibility: item.exchangeEligibility || 'No',
        status: item.status || 'unpublished'
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const itemData = {
        ...formData,
        quantityStock: parseInt(formData.quantityStock),
        mrp: parseFloat(formData.mrp),
        sellingPrice: parseFloat(formData.sellingPrice),
        // Handle images: if URL input exists, use it. Backend expects array.
        images: formData.imageInput ? [formData.imageInput] : []
      };

      await itemService.updateItem(id, itemData);
      navigate(`/products`);
    } catch (err) {
      setError(err.message || 'Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading product..." />;

  return (
    <div className="form-page">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit} className="form">
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
            Status
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
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditItem;
