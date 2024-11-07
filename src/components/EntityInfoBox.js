import React, { useState, useEffect } from 'react';
import { fetchWikidataEntity } from '../utils/wikidata';

const EntityInfoBox = ({ entityId, entityType }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntityData = async () => {
      setLoading(true);
      const data = await fetchWikidataEntity(entityId, entityType);
      setData(data);
      setLoading(false);
    };

    loadEntityData();
  }, [entityId, entityType]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-100 rounded"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
      </div>
    );
  }

  const InfoRow = ({ label, value }) => value && (
    <div className="border-l-2 border-olympic-blue pl-3 py-2 mb-3">
      <span className="text-sm text-gray-500 block">{label}</span>
      <span className="font-light">{value}</span>
    </div>
  );

  // Generic content renderer that works with both base and specific type data
  const renderContent = () => {
    if (!data) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-light tracking-wide mb-2">
          {data.label?.value}
        </h3>
        
        {data.description?.value && (
          <p className="text-gray-600 italic">
            {data.description.value}
          </p>
        )}

        {data.image?.value && (
          <img 
            src={data.image.value} 
            alt={data.label?.value}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <div className="space-y-2 mt-4">
          {/* Show type information if available */}
          {data.typeLabel?.value && (
            <InfoRow 
              label="Type"
              value={data.typeLabel.value}
            />
          )}

          {/* Show Wikipedia link if available */}
          {data.wikipediaUrl?.value && (
            <InfoRow 
              label="Wikipedia"
              value={
                <a 
                  href={data.wikipediaUrl.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-olympic-blue hover:underline"
                >
                  Read more
                </a>
              }
            />
          )}

          {/* Render any additional properties that might come from specific type queries */}
          {Object.entries(data)
            .filter(([key, value]) => 
              // Filter out already handled properties and ensure value exists
              !['label', 'description', 'image', 'typeLabel', 'wikipediaUrl'].includes(key) &&
              key.endsWith('Label') && 
              value?.value
            )
            .map(([key, value]) => {
              const label = key
                .replace('Label', '')
                .replace(/([A-Z])/g, ' $1')
                .toLowerCase()
                .replace(/^./, str => str.toUpperCase());

              return (
                <InfoRow
                  key={key}
                  label={label}
                  value={value.value}
                />
              );
            })}
        </div>
      </div>
    );
  };

  return (
    <div className="entity-info">
      {renderContent()}
    </div>
  );
};

export default EntityInfoBox;