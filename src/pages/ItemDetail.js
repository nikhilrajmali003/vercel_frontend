import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { itemService } from '../services/itemService';
import Loading from '../components/UI/Loading';
import Error from '../components/UI/Error';
import Button from '../components/UI/Button';
import './ItemDetail.css';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemService.getItemById(id);
      setItem(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemService.deleteItem(id);
        navigate('/items');
      } catch (err) {
        setError(err.message || 'Failed to delete item');
      }
    }
  };

  if (loading) return <Loading message="Loading item..." />;
  if (error) return <Error message={error} onRetry={fetchItem} />;
  if (!item) return <Error message="Item not found" />;

  return (
    <div className="item-detail">
      <div className="item-detail-header">
        <Link to="/items" className="back-link">← Back to Items</Link>
        <div className="item-detail-actions">
          <Link to={`/items/${id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="item-detail-content">
        {item.image && (
          <div className="item-detail-image">
            <img src={item.image} alt={item.title} />
          </div>
        )}
        <div className="item-detail-info">
          <h1 className="item-detail-title">{item.title}</h1>
          <div className="item-detail-meta">
            {item.category && (
              <span className="item-detail-category">{item.category}</span>
            )}
            {item.price && (
              <span className="item-detail-price">${item.price}</span>
            )}
            <span className={`item-detail-status status-${item.status}`}>
              {item.status}
            </span>
          </div>
          {item.description && (
            <div className="item-detail-description">
              <h3>Description</h3>
              <p>{item.description}</p>
            </div>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="item-detail-tags">
              <h3>Tags</h3>
              <div className="tags-list">
                {item.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
          {item.createdBy && (
            <div className="item-detail-creator">
              <p>
                Created by: <strong>{item.createdBy.name || item.createdBy.email}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
