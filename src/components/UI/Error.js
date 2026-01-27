import React from 'react';
import './Error.css';

const Error = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">Error</h3>
      <p className="error-message">{message || 'Something went wrong'}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-retry">
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;
