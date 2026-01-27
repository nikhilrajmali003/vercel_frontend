import React, { useState, useEffect, useContext } from 'react';
import { itemService } from '../services/itemService';
import { ToastContext } from '../context/ToastContext';
import { AuthContext } from '../context/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import Loading from '../components/UI/Loading';
import Error from '../components/UI/Error';
import AddProductModal from '../components/Products/AddProductModal';
import EditProductModal from '../components/Products/EditProductModal';
import DeleteProductModal from '../components/Products/DeleteProductModal';
import ProductCard from '../components/Products/ProductCard';
import './Products.css';

const Products = () => {
  const { showToast } = useContext(ToastContext);
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemService.getAllItems({});
      const allProducts = response.data || [];

      setProducts(allProducts);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleProductAdded = () => {
    setShowAddModal(false);
    showToast('Product added Successfully', 'success');
    fetchProducts();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleCloseEditModal = () => {
    setEditingProduct(null);
  };

  const handleProductUpdated = () => {
    setEditingProduct(null);
    showToast('Product updated Successfully', 'success');
    fetchProducts();
  };

  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;

    try {
      await itemService.deleteItem(deletingProduct._id);
      setDeletingProduct(null);
      showToast('Product Deleted Successfully', 'success');
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      showToast(err.message || 'Failed to delete product', 'error');
      setDeletingProduct(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingProduct(null);
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 'published' ? 'unpublished' : 'published';
      await itemService.updateItemStatus(product._id, newStatus);
      showToast(`Product ${newStatus === 'published' ? 'Published' : 'Unpublished'} Successfully`, 'success');
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Failed to update product status');
      showToast(err.message || 'Failed to update product status', 'error');
    }
  };

  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      product.productName?.toLowerCase().includes(search) ||
      product.brandName?.toLowerCase().includes(search) ||
      product.productType?.toLowerCase().includes(search)
    );
  });

  return (
    <DashboardLayout>
      <div className="products-page">
        {loading && <Loading message="Loading products..." />}
        {error && <Error message={error} onRetry={fetchProducts} />}
        {!loading && !error && (
          <>
            <div className="products-header">
              <h1 className="products-title">Products</h1>
              <button className="add-product-btn" onClick={handleAddProduct}>
                + Add Products
              </button>
            </div>



            {filteredProducts.length === 0 ? (
              <div className="products-empty">
                <div className="empty-icon">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2400FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <line x1="17.5" y1="14" x2="17.5" y2="21" />
                    <line x1="14" y1="17.5" x2="21" y2="17.5" />
                  </svg>
                </div>
                <h2 className="empty-title">
                  Feels a little empty over here...
                </h2>
                <p className="empty-description">
                  You can create products without connecting store you can add products to store anytime
                </p>
                <button className="empty-add-btn" onClick={handleAddProduct}>
                  Add your Products
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    currentUser={user}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteClick}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {showAddModal && (
          <AddProductModal
            onClose={handleCloseAddModal}
            onSuccess={handleProductAdded}
          />
        )}

        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onClose={handleCloseEditModal}
            onSuccess={handleProductUpdated}
          />
        )}

        {deletingProduct && (
          <DeleteProductModal
            product={deletingProduct}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Products;
