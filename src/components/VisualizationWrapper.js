import React from 'react';
import OlympicRaceChart from './visualizations/OlympicRaceChart';

const VisualizationWrapper = ({ visualization }) => {
  const renderVisualization = () => {
    switch (visualization.type) {
      case 'OlympicRaceChart':
        // Using process.env.PUBLIC_URL to ensure correct path resolution
        const dataPath = `${process.env.PUBLIC_URL}/data/${visualization.data}`;
        console.log('Loading data from:', dataPath); // Debug log
        return (
          <div className="bg-white p-8 border-l-4 border-olympic-blue mt-8">
            <h2 className="text-2xl font-light mb-6">{visualization.title}</h2>
            <div className="h-[600px]">
              <OlympicRaceChart dataSource={dataPath} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderVisualization();
};

export default VisualizationWrapper;