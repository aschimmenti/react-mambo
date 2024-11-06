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

  const renderContent = () => {
    switch (entityType) {
      case 'person':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-light tracking-wide mb-2">{data?.label?.value}</h3>
            {data?.occupationLabel?.value && (
              <p className="text-olympic-blue italic">
                {data.occupationLabel.value}
              </p>
            )}
            <div className="space-y-2 mt-4">
              <InfoRow 
                label="Born"
                value={data?.birthDate?.value && 
                  `${new Date(data.birthDate.value).toLocaleDateString()}${
                    data?.birthPlaceLabel?.value ? ` in ${data.birthPlaceLabel.value}` : ''
                  }`
                }
              />
              <InfoRow 
                label="Nationality"
                value={data?.nationalityLabel?.value}
              />
            </div>
          </div>
        );

      case 'place':
      case 'country':
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-light tracking-wide mb-2">{data?.label?.value}</h3>
            <div className="space-y-2">
              <InfoRow 
                label="Country"
                value={data?.countryLabel?.value}
              />
              <InfoRow 
                label="Population"
                value={data?.population?.value && 
                  parseInt(data.population.value).toLocaleString()
                }
              />
              <InfoRow 
                label="Continent"
                value={data?.continentLabel?.value}
              />
            </div>
          </div>
        );

      default:
        return <p>Unknown entity type</p>;
    }
  };

  return (
    <div className="entity-info">
      {renderContent()}
    </div>
  );
};

export default EntityInfoBox;