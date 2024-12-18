import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EntityInfoBox from '../components/EntityInfoBox';
import NewsArticleSection from '../components/NewsArticleSection';
import VisualizationWrapper from '../components/VisualizationWrapper';
import QuotesAndRelationships from '../components/QuotesAndRelationships';
import storyKG from '../stories/StoryKG.json';
import LinguisticAnalysisSlideshow from '../components/LinguisticAnalysisSlideshow';
import relationshipsData from '../stories/relationships.json';
import WordClouds from '../components/visualizations/WordClouds';
import '../styles/DataStoryPage.css';

const DataStoryPage = () => {
  const { id } = useParams();
  const [selectedEntity, setSelectedEntity] = useState(null);

  // Find the story based on URL parameter
  const story = storyKG.stories.find(s => s.storyId === id);
  if (!story) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 border-l-4 border-olympic-red">
          <h1 className="text-4xl md:text-5xl mb-8 font-light tracking-wide">
            Story not found
          </h1>
        </div>
      </div>
    );
  }
  
  // Debug logs
  console.log('Current story ID:', id);
  console.log('Found story:', story);
  console.log('Story visualizations:', story.content.visualizations);

  const showLinguisticAnalysis = story.storyId === "Q1890705"; // Black Power salute story
  const showQuotesAndRelationships = story.sentences && story.sentences.length > 0;
  const showNewsArticles = story['news-articles'] && story['news-articles'].length > 0;
  const isRepresentationBiasStory = story.storyId === "Q8752";


  const processTextToComponents = (text, entities) => {
    // Create a map of all possible entity mentions to their IDs
    const mentionMap = Object.entries(entities).reduce((acc, [id, entity]) => {
      // Add the main label with priority 2
      acc.push({
        text: entity.label,
        id,
        type: entity.type,
        priority: 2
      });
      // Add aliases with priority 1
      entity.aliases.forEach(alias => {
        acc.push({
          text: alias,
          id,
          type: entity.type,
          priority: 1
        });
      });
      return acc;
    }, []);

    // Sort mentions by length (longest first) and then by priority
    const sortedMentions = mentionMap.sort((a, b) => {
      const lengthDiff = b.text.length - a.text.length;
      return lengthDiff !== 0 ? lengthDiff : b.priority - a.priority;
    });

    let processedText = text;
    const replacements = [];
    const usedRanges = [];

    // Find all mentions and their positions, avoiding overlaps
    sortedMentions.forEach(mention => {
      const regex = new RegExp(`\\b${mention.text}\\b`, 'gi');
      let match;

      while ((match = regex.exec(processedText)) !== null) {
        const start = match.index;
        const end = start + mention.text.length;

        // Check if this range overlaps with any existing ones
        const hasOverlap = usedRanges.some(([usedStart, usedEnd]) =>
          (start >= usedStart && start < usedEnd) ||
          (end > usedStart && end <= usedEnd)
        );

        if (!hasOverlap) {
          replacements.push({
            start,
            end,
            text: mention.text,
            id: mention.id,
            type: mention.type
          });
          usedRanges.push([start, end]);
        }
      }
    });

    // Sort replacements by position
    replacements.sort((a, b) => a.start - b.start);

    // Build the result array
    const result = [];
    let lastIndex = 0;

    replacements.forEach((replacement, index) => {
      // Add text before the entity
      if (replacement.start > lastIndex) {
        result.push(
          <span key={`text-${index}`} className="text-gray-700">
            {processedText.slice(lastIndex, replacement.start)}
          </span>
        );
      }

      // Add the entity button
      result.push(
        <button
          key={`entity-${index}`}
          onClick={() => setSelectedEntity({ id: replacement.id, type: replacement.type })}
          className="btn btn-link p-0 text-decoration-none entity-link"
          style={{
            color: '#2563EB',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            lineHeight: 'inherit',
            verticalAlign: 'baseline',
            margin: 0,
            padding: 0,
            border: 'none',
            background: 'none'
          }}
        >
          {replacement.text}
        </button>
      );

      lastIndex = replacement.end;
    });

    // Add any remaining text
    if (lastIndex < processedText.length) {
      result.push(
        <span key="text-final" className="text-gray-700">
          {processedText.slice(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white p-8 border-l-4 border-olympic-blue">
            <h1 className="text-4xl md:text-5xl mb-8 font-light tracking-wide">
              {story.title}
            </h1>
            <div className="prose prose-lg max-w-none">
              {processTextToComponents(story.content.mainText, story.entities)}
            </div>
          </div>

          {/* Merged visualization handling */}
          {story.content.visualizations?.map((viz, index) => {
            // All visualizations are now handled here
            if (
              // Sport concepts visualization
              (story.storyId === "sport-concepts" && viz.type === "SportConceptsVisualization") ||
              // Race chart and word clouds for representation bias story
              (story.storyId === "Q8752" && (
                viz.type === "OlympicRaceChart" || 
                viz.type === "WordClouds"
              )) ||
              // Linguistic analysis for black power story
              (story.storyId === "Q1890705" && viz.type === "LinguisticAnalysis")
            ) {
              return (
                <VisualizationWrapper 
                  key={index} 
                  visualization={viz} 
                  storyId={story.storyId}
                />
              );
            }
            return null;
          })}

          {isRepresentationBiasStory && <WordClouds />}

          {/* Story-specific components */}
          {showQuotesAndRelationships && (
            <QuotesAndRelationships 
              relationships={relationshipsData}
              quotes={story.sentences}
              onEntityClick={setSelectedEntity}
            />
          )}

          {showLinguisticAnalysis && <LinguisticAnalysisSlideshow />}

          {showNewsArticles && (
            <NewsArticleSection
              articles={story['news-articles']}
              entities={story.entities}
              onEntityClick={setSelectedEntity}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-8">
            {selectedEntity ? (
              <div className="bg-white p-6 border-t-4 border-olympic-yellow">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-xl font-light tracking-wide">Entity Information</h5>
                  <button
                    onClick={() => setSelectedEntity(null)}
                    className="text-olympic-black hover:text-olympic-red transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    ×
                  </button>
                </div>
                <EntityInfoBox
                  entityId={selectedEntity.id}
                  entityType={selectedEntity.type}
                />
              </div>
            ) : (
              <div className="bg-white p-6 border-t-4 border-olympic-green">
                <div className="text-center text-gray-500 py-8">
                  <p className="text-lg font-light">
                    Click on any highlighted text to see more information
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataStoryPage;