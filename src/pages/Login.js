import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Request OTP from backend
      await userService.requestOTP(formData.email);
      // Step 2: Navigate to separate OTP page
      navigate('/otp', { state: { email: formData.email } });
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        setError(err.errors.map(e => e.msg).join(', '));
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <div className="login-logo">
          <span className="logo-text">Productr</span>
          <span className="logo-icon">∞</span>
        </div>
        <span className="login-header-text">Login</span>
      </div>

      <div className="login-container">
        <div className="login-left">
          <div className="login-visual">
            <div className="visual-background"></div>
            <img
              src="/images/login-visual.png"
              alt="Productr Visual"
              className="visual-image"
            />
          </div>
        </div>

        <div className="login-right">
          <div className="login-right-content">
            <h1 className="login-title">Login to your Productr Account</h1>
            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="login-error">{error}</div>}

              <div className="login-input-group">
                <label htmlFor="email" className="login-label">Email or Phone number</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email or phone number"
                  className="login-input"
                  required
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Login'}
              </button>

              <div className="login-signup-box">
                <span className="login-signup-text">Don't have a Productr Account?</span>
                <Link to="/register" className="login-signup-link">SignUp Here</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
