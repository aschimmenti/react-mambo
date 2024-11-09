import React from 'react';
import OlympicRaceChart from './visualizations/OlympicRaceChart';
import SportConceptsVisualization from './visualizations/SportConceptsVisualization';
import wikiData from '../data/art_meta_wikidata.json';
import wikiConceptData from '../data/concept_wikidata_artworks.json';
import rijksData from '../data/art_meta_rijks.json';
import rijksConceptData from '../data/concept_art_rijks.json';
import euroData from '../data/art_meta_euro.json';
import euroConceptData from '../data/concept_art_euro.json';


const VisualizationWrapper = ({ visualization }) => {
  console.log('VisualizationWrapper received:', visualization);

  const renderVisualization = () => {
    switch (visualization?.type) {
      case 'OlympicRaceChart':
        const dataPath = `${process.env.PUBLIC_URL}/data/${visualization.data}`;
        return (
          <div className="bg-white p-8 border-l-4 border-olympic-blue mt-8">
            <h2 className="text-2xl font-light mb-6">{visualization.title}</h2>
            <div className="h-[600px]">
              <OlympicRaceChart dataSource={dataPath} />
            </div>
          </div>
        );

      case 'SportConceptsVisualization':
        console.log('Rendering SportConceptsVisualization');
        return (
          <div className="bg-white p-8 border-l-4 border-olympic-blue mt-8">
            <h2 className="text-2xl font-light mb-6">{visualization.title}</h2>
            <SportConceptsVisualization
            data={{
              artMetadataWiki: wikiData,
              conceptDataWiki: wikiConceptData,
              artMetadataRijks: rijksData,
              conceptDataRijks: rijksConceptData,
              artMetadataEuro: euroData,
              conceptDataEuro: euroConceptData
            }}
          />
          </div>
        );

      default:
        console.log('No matching visualization type found');
        return (
          <div className="bg-white p-8 border-l-4 border-olympic-red mt-8">
            <h2 className="text-2xl font-light mb-6">Unknown Visualization Type</h2>
            <pre>{JSON.stringify(visualization, null, 2)}</pre>
          </div>
        );
    }
  };

  if (!visualization) {
    return (
      <div className="bg-white p-8 border-l-4 border-olympic-red mt-8">
        <h2 className="text-2xl font-light mb-6">No Visualization Data</h2>
      </div>
    );
  }

  return renderVisualization();
};

export default VisualizationWrapper;