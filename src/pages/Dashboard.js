import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { itemService } from '../services/itemService';
import DashboardLayout from '../components/Layout/DashboardLayout';
import ProductCard from '../components/Products/ProductCard';
import Loading from '../components/UI/Loading';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('published');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await itemService.getAllItems({});
      const allProducts = response.data || [];

      const filtered = allProducts.filter(product => {
        if (activeTab === 'published') {
          return product.status === 'published';
        } else {
          return product.status === 'unpublished' || !product.status;
        }
      });

      setProducts(filtered);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 'published' ? 'unpublished' : 'published';
      await itemService.updateItemStatus(product._id, newStatus);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product status:', err);
    }
  };

  const handleEdit = (product) => {
    window.location.href = `/products`;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await itemService.deleteItem(id);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="dashboard-tabs">
          <button
            className={`tab-button ${activeTab === 'published' ? 'active' : ''}`}
            onClick={() => setActiveTab('published')}
          >
            Published
          </button>
          <button
            className={`tab-button ${activeTab === 'unpublished' ? 'active' : ''}`}
            onClick={() => setActiveTab('unpublished')}
          >
            Unpublished
          </button>
        </div>

        {loading ? (
          <Loading message="Loading products..." />
        ) : products.length === 0 ? (
          <div className="dashboard-empty">
            <div className="empty-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="10" y="10" width="30" height="30" rx="4" fill="#1a1a2e" opacity="0.1" />
                <rect x="50" y="10" width="30" height="30" rx="4" fill="#1a1a2e" opacity="0.1" />
                <rect x="10" y="50" width="30" height="30" rx="4" fill="#1a1a2e" opacity="0.1" />
                <rect x="50" y="50" width="30" height="30" rx="4" fill="#1a1a2e" />
                <path d="M60 60l10 10M60 70l10-10" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="empty-title">
              {activeTab === 'published' ? 'No Published Products' : 'No Unpublished Products'}
            </h2>
            <p className="empty-description">
              Your {activeTab === 'published' ? 'Published' : 'Unpublished'} Products will appear here
            </p>
            <p className="empty-description">
              Create your first product to publish
            </p>
          </div>
        ) : (
          <div className="dashboard-products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                currentUser={user} // Pass current user to check ownership
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
