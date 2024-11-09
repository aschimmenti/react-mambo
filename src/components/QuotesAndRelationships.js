import React, { useState, useEffect } from 'react';
import { fetchWikidataEntity } from '../utils/wikidata';

const QuotesAndRelationships = ({ relationships = [], quotes = [], onEntityClick }) => {
  // State for speaker data
  const [speakerData, setSpeakerData] = useState({});
  const [loading, setLoading] = useState(true);

  // Group relationships by subject, with null check
  const groupedRelationships = (relationships || []).reduce((acc, rel) => {
    if (!rel?.subject?.uri) return acc;
    
    const subjectUri = rel.subject.uri;
    if (!acc[subjectUri]) {
      acc[subjectUri] = {
        subject: rel.subject,
        relationships: []
      };
    }
    acc[subjectUri].relationships.push({
      predicate: rel.predicate,
      object: rel.object
    });
    return acc;
  }, {});

  // Get speaker info with null checks
  const getSpeakerInfo = (speakerId) => {
    if (!speakerId) return { name: "Unknown Speaker", uri: null };
    
    const speaker = Object.values(groupedRelationships).find(
      group => group?.subject?.uri?.endsWith(speakerId)
    );
    return {
      name: speaker ? speaker.subject.text : "Unknown Speaker",
      uri: speaker ? speaker.subject.uri : null
    };
  };

  // Fetch speaker data from Wikidata
  useEffect(() => {
    const loadSpeakerData = async () => {
      if (!quotes?.length) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const uniqueSpeakers = [...new Set(quotes.map(quote => quote.speaker))].filter(Boolean);
      
      const speakerPromises = uniqueSpeakers.map(async (speakerId) => {
        const data = await fetchWikidataEntity(speakerId);
        return [speakerId, data];
      });

      const speakerResults = await Promise.all(speakerPromises);
      const speakerMap = Object.fromEntries(speakerResults);
      
      setSpeakerData(speakerMap);
      setLoading(false);
    };

    loadSpeakerData();
  }, [quotes]);

  const renderSpeakerImage = (speakerId) => {
    if (!speakerId) return null;
    
    const speaker = speakerData[speakerId];
    if (!speaker?.image?.value) {
      return (
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-xl">
            {getSpeakerInfo(speakerId).name.charAt(0)}
          </span>
        </div>
      );
    }

    return (
      <img 
        src={speaker.image.value}
        alt={speaker.label?.value || getSpeakerInfo(speakerId).name}
        className="w-12 h-12 rounded-full object-cover"
      />
    );
  };

  // Don't render anything if no data is provided
  if (!quotes?.length && !relationships?.length) {
    return null;
  }

  return (
    <div className="mt-8 space-y-8">
      {/* Quotes Section */}
      {quotes?.length > 0 && (
        <div className="bg-white rounded-lg overflow-hidden border-l-4 border-blue-500">
          <div className="p-6">
            <h2 className="text-2xl font-light mb-6">Notable Quotes</h2>
            <div className="grid gap-6">
              {quotes.map((quote, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex gap-4">
                    {/* Speaker Image and Info */}
                    {quote.speaker && (
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => onEntityClick?.({ 
                            id: quote.speaker, 
                            type: 'person'
                          })}
                          className="hover:opacity-80 transition-opacity"
                        >
                          {renderSpeakerImage(quote.speaker)}
                        </button>
                      </div>
                    )}
                    
                    {/* Quote Content */}
                    <div className="flex-grow">
                      <blockquote className="text-lg text-gray-700 italic mb-3">
                        "{quote.quote}"
                      </blockquote>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        {quote.speaker && (
                          <button
                            onClick={() => onEntityClick?.({ 
                              id: quote.speaker, 
                              type: 'person'
                            })}
                            className="font-medium hover:text-blue-600 transition-colors"
                          >
                            {getSpeakerInfo(quote.speaker).name}
                          </button>
                        )}
                        {quote.date && <div>{quote.date}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Relationships Section */}
      {relationships?.length > 0 && (
        <div className="bg-white rounded-lg overflow-hidden border-l-4 border-yellow-500">
          <div className="p-6">
            <h2 className="text-2xl font-light mb-6">Key Relationships</h2>
            <div className="space-y-6">
              {Object.values(groupedRelationships).map((group, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {group.subject && (
                    <button
                      onClick={() => onEntityClick?.({ 
                        id: group.subject.uri.split('/').pop(), 
                        type: 'entity'
                      })}
                      className="text-xl font-medium mb-3 text-gray-800 hover:text-blue-600 transition-colors text-left w-full"
                    >
                      {group.subject.text}
                    </button>
                  )}
                  <div className="space-y-2">
                    {group.relationships.map((rel, relIndex) => {
                      if (!rel?.predicate || !rel?.object) return null;

                      const isDuplicate = group.relationships.findIndex(
                        r => r.predicate === rel.predicate && 
                             r.object.text === rel.object.text
                      ) !== relIndex;
                      
                      if (isDuplicate) return null;

                      return (
                        <div 
                          key={relIndex} 
                          className="flex items-start space-x-2 text-gray-600"
                        >
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {rel.predicate}
                          </span>
                          {rel.object.uri && (
                            <button
                              onClick={() => onEntityClick?.({ 
                                id: rel.object.uri.split('/').pop(), 
                                type: 'entity'
                              })}
                              className="flex-grow text-left hover:text-blue-600 transition-colors"
                            >
                              {rel.object.text}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesAndRelationships;