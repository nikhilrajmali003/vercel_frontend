import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">Welcome to Figma Assignment</h1>
        <p className="home-subtitle">
          A full-stack MERN application with React, Express, Node.js, and MongoDB
        </p>
        <div className="home-actions">
          <Link to="/items" className="home-button primary">
            View Items
          </Link>
          <Link to="/register" className="home-button secondary">
            Get Started
          </Link>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <h3>🚀 Modern Stack</h3>
          <p>Built with React, Express, Node.js, and MongoDB</p>
        </div>
        <div className="feature-card">
          <h3>📱 Responsive Design</h3>
          <p>Works seamlessly on all devices</p>
        </div>
        <div className="feature-card">
          <h3>🔒 Secure</h3>
          <p>Authentication and authorization built-in</p>
        </div>
        <div className="feature-card">
          <h3>⚡ Fast & Efficient</h3>
          <p>Optimized for performance</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
