// src/components/Hero.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [entityId, setEntityId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entityId.trim()) {
      navigate(`/story/${entityId}`);
    }
  };

  return (
    <div className="px-4 py-5 my-5 text-center">
      <div className="container">
        <h1 className="display-4 fw-bold text-body-emphasis mb-4">
          Explore Data Stories
        </h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            Discover fascinating stories through data visualization and analysis.
            Enter a Wikidata entity ID to get started.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <form onSubmit={handleSubmit} className="w-100 max-w-md">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Wikidata ID (e.g., Q11459)"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  Explore
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;