import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import Error from '../components/UI/Error';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (!formData.name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    if (formData.name.length > 100) {
      setError('Name cannot exceed 100 characters');
      setLoading(false);
      return;
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setError('Please provide a valid email');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await userService.register(registerData);
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        navigate('/', { replace: true });
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        // Handle specific validation errors from backend
        const errorMessages = err.errors.map(e => e.msg).join(', ');
        setError(errorMessages);
      } else if (err.message && err.message.includes('already exists')) {
        setError(
          <span>
            This email is already registered. <Link to="/login" style={{ color: 'inherit', textDecoration: 'underline' }}>Login here</Link>
          </span>
        );
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <Error message={error} />}

          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="auth-button"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <p className="auth-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
