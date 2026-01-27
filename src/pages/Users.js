import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import Loading from '../components/UI/Loading';
import Error from '../components/UI/Error';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading users..." />;
  if (error) return <Error message={error} onRetry={fetchUsers} />;

  return (
    <div className="users-page">
      <h1>Users</h1>
      <div className="users-grid">
        {users.length === 0 ? (
          <div className="users-empty">
            <p>No users found.</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <p className="user-email">{user.email}</p>
                <span className={`user-role role-${user.role}`}>
                  {user.role}
                </span>
                <span className={`user-status ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
