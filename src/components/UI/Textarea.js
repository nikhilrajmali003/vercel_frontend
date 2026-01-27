import React from 'react';
import './Textarea.css';

const Textarea = ({ label, name, value, onChange, error, placeholder, required = false, rows = 4 }) => {
  return (
    <div className="textarea-group">
      {label && (
        <label htmlFor={name} className="textarea-label">
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`textarea-field ${error ? 'textarea-error' : ''}`}
      />
      {error && <span className="textarea-error-message">{error}</span>}
    </div>
  );
};

export default Textarea;
