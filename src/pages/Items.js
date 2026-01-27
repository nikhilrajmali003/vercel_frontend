import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import Loading from '../components/UI/Loading';
import Error from '../components/UI/Error';
import Button from '../components/UI/Button';
import './Items.css';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchItems();
  }, [category, searchTerm]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (category) params.category = category;
      if (searchTerm) params.search = searchTerm;

      const response = await itemService.getAllItems(params);
      setItems(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(id);
        fetchItems();
      } catch (err) {
        setError(err.message || 'Failed to delete item');
      }
    }
  };

  if (loading) return <Loading message="Loading items..." />;
  if (error) return <Error message={error} onRetry={fetchItems} />;

  return (
    <div className="items-page">
      <div className="items-header">
        <h1>Items</h1>
        <Link to="/items/create">
          <Button variant="primary">Create New Item</Button>
        </Link>
      </div>

      <div className="items-filters">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="items-search"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="items-filter"
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="items-grid">
        {items.length === 0 ? (
          <div className="items-empty">
            <p>No items found. Create your first item!</p>
            <Link to="/items/create">
              <Button variant="primary">Create Item</Button>
            </Link>
          </div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="item-card">
              {item.image && (
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
              )}
              <div className="item-content">
                <h3 className="item-title">{item.title}</h3>
                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}
                <div className="item-meta">
                  {item.category && (
                    <span className="item-category">{item.category}</span>
                  )}
                  {item.price && (
                    <span className="item-price">${item.price}</span>
                  )}
                </div>
                <div className="item-actions">
                  <Link to={`/items/${item._id}`}>
                    <Button variant="primary">View</Button>
                  </Link>
                  <Link to={`/items/${item._id}/edit`}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Items;
