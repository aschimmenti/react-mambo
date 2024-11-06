import React from 'react';

const EnhancedTitle = () => {
  return (
    <h1 className="position-absolute w-100 text-center display-3 fw-bold mt-4 z-3"
        style={{
          background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
        }}>
      <span className="position-relative">
        Explore Data Stories
      </span>
    </h1>
  );
};

export default EnhancedTitle;