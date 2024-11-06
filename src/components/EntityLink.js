import React from 'react';

const EntityLink = ({ id, type, children, onClick }) => {
  return (
    <button
      className="btn btn-link p-0 border-0 text-decoration-none"
      onClick={() => onClick(id, type)}
    >
      {children}
    </button>
  );
};

export default EntityLink;