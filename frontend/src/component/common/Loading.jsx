import React from 'react';

const Loading = ({ message = 'Đang tải...', size = 'medium' }) => {
  return (
    <div className={`loading-container ${size === 'small' ? 'loading-small' : size === 'large' ? 'loading-large' : ''}`}>
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;

