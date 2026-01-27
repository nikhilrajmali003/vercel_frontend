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
    title: '',
    description: '',
    image: '',
    category: '',
    price: '',
    status: 'active',
    tags: ''
  });

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemService.getItemById(id);
      const item = response.data;
      setFormData({
        title: item.title || '',
        description: item.description || '',
        image: item.image || '',
        category: item.category || '',
        price: item.price || '',
        status: item.status || 'active',
        tags: item.tags ? item.tags.join(', ') : ''
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
        price: formData.price ? parseFloat(formData.price) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      await itemService.updateItem(id, itemData);
      navigate(`/items/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading item..." />;

  return (
    <div className="form-page">
      <h1>Edit Item</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <Error message={error} />}

        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
        />

        <Input
          label="Image URL"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
        />

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category" className="input-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>
          </div>

          <Input
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>

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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <Input
          label="Tags (comma-separated)"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="tag1, tag2, tag3"
        />

        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/items/${id}`)}
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
