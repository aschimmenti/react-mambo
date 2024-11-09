import React, { useState, useMemo } from 'react';

const SportConceptsVisualization = ({ data }) => {
  const [selectedConcepts, setSelectedConcepts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [dataSource, setDataSource] = useState('all'); // 'all', 'wikidata', 'rijks', or 'europeana'

  const { 
    artMetadataWiki,
    conceptDataWiki,
    artMetadataRijks,
    conceptDataRijks,
    artMetadataEuro,
    conceptDataEuro 
  } = data;

  // Clean and validate Europeana artwork data
  const cleanEuroArtworkData = useMemo(() => {
    const cleanData = {};
    Object.entries(artMetadataEuro || {}).forEach(([id, artwork]) => {
      if (artwork?.title) {
        cleanData[id] = {
          ...artwork,
          title: [artwork.title], // Wrap in array to match other sources
          image: artwork.image,
          description: artwork.description,
          subjects: {}, // Will be populated from concepts
          source: 'europeana',
          // Additional Europeana-specific fields
          country: artwork.country,
          creator: artwork.creator,
          language: artwork.language,
          provider: artwork.provider
        };
      }
    });
    return cleanData;
  }, [artMetadataEuro]);

  const cleanRijksArtworkData = useMemo(() => {
    const cleanData = {};
    Object.entries(artMetadataRijks).forEach(([id, artwork]) => {
      if (artwork?.title?.[0]) {
        // Find English versions or fallback to first available
        const title = artwork.title.find(t => t.endsWith('@en')) || artwork.title[0];
        const description = artwork.description?.find(d => d.endsWith('@en')) || artwork.description?.[0];
        const created = artwork.created?.find(c => c.endsWith('@en')) || artwork.created?.[0];
        const isPartOf = artwork.isPartOf?.find(p => p.endsWith('@en')) || artwork.isPartOf?.[0];
        
        // // Clean dimensions from extent
        // const dimensions = artwork.extent?.reduce((acc, dim) => {
        //   if (dim.endsWith('@en')) {
        //     const cleanDim = dim.split('@')[0].trim();
        //     if (cleanDim.includes('height')) acc.height = cleanDim;
        //     if (cleanDim.includes('width')) acc.width = cleanDim;
        //     if (cleanDim.includes('depth')) acc.depth = cleanDim;
        //   }
        //   return acc;
        // }, {});

        // Clean subjects
        // const subjects = (artwork.subject || [])
        //   .map(s => {
        //     if (s.startsWith('<')) {
        //       return s.split('>')[0].split('/').pop();
        //     }
        //     return s.split('@')[0];
        //   })
        //   .filter(s => !s.match(/^\d/));

          cleanData[id] = {
            ...artwork,
            title: [title.split('@')[0]],
            description: description ? description.split('@')[0] : null,
            created: created ? created.split('@')[0] : null,
            collection: isPartOf ? isPartOf.split('@')[0] : null,
            identifier: artwork.identifier?.[0],
            publisher: artwork.publisher?.[0],
            temporal: artwork.temporal?.find(t => t.endsWith('@en'))?.split('@')[0],
            link: id, // Store the handle URL for linking
            source: 'rijks'
          };
      }
    });
    return cleanData;
  }, [artMetadataRijks]);

  // Clean and validate Wikidata artwork data
  const cleanWikiArtworkData = useMemo(() => {
    const cleanData = {};
    Object.entries(artMetadataWiki).forEach(([id, artwork]) => {
      if (
        artwork?.title?.[0] && 
        artwork.title[0] !== "NaN" &&
        (
          (artwork.subjects && Object.values(artwork.subjects).some(subject => subject !== "NaN")) ||
          (artwork.image && artwork.image !== "NaN")
        )
      ) {
        cleanData[id] = {
          ...artwork,
          subjects: Object.fromEntries(
            Object.entries(artwork.subjects || {}).filter(([_, value]) => value !== "NaN")
          ),
          title: artwork.title.filter(t => t && t !== "NaN"),
          image: artwork.image === "NaN" ? null : artwork.image,
          source: 'wikidata'
        };
      }
    });
    return cleanData;
  }, [artMetadataWiki]);

  // Combine all artwork data
  const allArtworkData = useMemo(() => ({
    ...cleanWikiArtworkData,
    ...cleanRijksArtworkData,
    ...cleanEuroArtworkData
  }), [cleanWikiArtworkData, cleanRijksArtworkData, cleanEuroArtworkData]);


  // Extract unique concepts based on selected data source
  const concepts = useMemo(() => {
    const conceptSet = new Set();
    
    if (dataSource === 'all' || dataSource === 'wikidata') {
      Object.entries(conceptDataWiki)
        .filter(([concept, artworks]) => 
          artworks.length > 0 && 
          !concept.match(/^\d/) && 
          !concept.includes('(+') &&
          artworks.some(artworkId => cleanWikiArtworkData[artworkId])
        )
        .forEach(([concept]) => conceptSet.add(concept));
    }
    
    if (dataSource === 'all' || dataSource === 'rijks') {
      Object.keys(conceptDataRijks)
        .filter(concept => 
          !concept.match(/^\d/) &&
          concept.endsWith('@en')
        )
        .forEach(concept => conceptSet.add(concept.split('@')[0]));
    }

    if (dataSource === 'all' || dataSource === 'europeana') {
      Object.keys(conceptDataEuro)
        .filter(concept => 
          !concept.match(/^\d/)
        )
        .forEach(concept => conceptSet.add(concept));
    }
    
    return Array.from(conceptSet);
  }, [conceptDataWiki, conceptDataRijks, conceptDataEuro, cleanWikiArtworkData, dataSource]);

  // Filter concepts based on search query
  const filteredConcepts = useMemo(() => {
    return concepts.filter(concept =>
      concept.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [concepts, searchQuery]);

  // Filter artworks based on selected concepts
  const filteredArtworks = useMemo(() => {
    if (selectedConcepts.length === 0) return [];
    
    const artworkIds = new Set();
    selectedConcepts.forEach(concept => {
      const conceptWithTag = `${concept}@en`;
      
      // Add Wikidata artworks
      if (dataSource !== 'rijks' && dataSource !== 'europeana') {
        conceptDataWiki[concept]?.forEach(artworkId => {
          if (cleanWikiArtworkData[artworkId]) {
            artworkIds.add(artworkId);
          }
        });
      }
      
      // Add Rijksmuseum artworks
      if (dataSource !== 'wikidata' && dataSource !== 'europeana') {
        conceptDataRijks[conceptWithTag]?.forEach(artworkId => {
          if (cleanRijksArtworkData[artworkId]) {
            artworkIds.add(artworkId);
          }
        });
      }

      // Add Europeana artworks
      if (dataSource !== 'wikidata' && dataSource !== 'rijks') {
        conceptDataEuro[concept]?.forEach(artworkId => {
          if (cleanEuroArtworkData[artworkId]) {
            artworkIds.add(artworkId);
          }
        });
      }
    });
    
    return Array.from(artworkIds)
      .map(id => {
        const artwork = allArtworkData[id];
        if (!artwork) return null;
        
        // For Rijksmuseum artworks, get subjects from concepts
        if (artwork.source === 'rijks') {
          const artworkConcepts = Object.entries(conceptDataRijks)
            .filter(([_, artworks]) => artworks.includes(id))
            .map(([concept]) => concept.split('@')[0]);
          
          artwork.subjects = artworkConcepts.reduce((acc, concept, index) => {
            acc[index] = concept;
            return acc;
          }, {});
        }

        // For Europeana artworks, get subjects from concepts
        if (artwork.source === 'europeana') {
          const artworkConcepts = Object.entries(conceptDataEuro)
            .filter(([_, artworks]) => artworks.includes(id))
            .map(([concept]) => concept);
          
          artwork.subjects = artworkConcepts.reduce((acc, concept, index) => {
            acc[index] = concept;
            return acc;
          }, {});
        }
        
        return artwork;
      })
      .filter(Boolean);
  }, [selectedConcepts, conceptDataWiki, conceptDataRijks, conceptDataEuro, 
      cleanWikiArtworkData, cleanRijksArtworkData, cleanEuroArtworkData, 
      allArtworkData, dataSource]);

  const shouldShowImage = (artwork) => {
    return artwork.source === 'wikidata' && artwork.image;
  };

  return (
    <div className="space-y-6">
      {/* Data Source Selection */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            dataSource === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setDataSource('all')}
        >
          All Sources
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            dataSource === 'wikidata' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setDataSource('wikidata')}
        >
          Wikidata
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            dataSource === 'rijks' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setDataSource('rijks')}
        >
          Rijksmuseum
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            dataSource === 'europeana' ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
          onClick={() => setDataSource('europeana')}
        >
          Europeana
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="Search for sports concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Selected Concepts */}
        <div className="flex flex-wrap gap-2">
          {selectedConcepts.map(concept => (
            <span
              key={concept}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
            >
              {concept}
              <button
                onClick={() => setSelectedConcepts(prev => 
                  prev.filter(c => c !== concept)
                )}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-2 border rounded-lg max-h-60 overflow-y-auto">
            {filteredConcepts.map(concept => (
              <button
                key={concept}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  selectedConcepts.includes(concept) ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  if (!selectedConcepts.includes(concept)) {
                    setSelectedConcepts(prev => [...prev, concept]);
                  }
                  setSearchQuery('');
                }}
              >
                {concept}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtworks.map((artwork, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            {shouldShowImage(artwork) && (
              <div className="relative">
                <div className="h-48">
                  <img
                    src={artwork.image || "/api/placeholder/400/300"}
                    alt={artwork.title[0]}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/400/300";
                    }}
                  />
                </div>
              </div>
            )}
            <div className="p-4">
              <span className="absolute top-2 right-2 px-2 py-1 bg-black bg-opacity-50 text-white rounded text-sm">
                {artwork.source === 'wikidata' ? 'Wikidata' : 
                 artwork.source === 'rijks' ? 'Rijksmuseum' : 'Europeana'}
              </span>
              
              <h3 className="text-lg font-medium mb-2 line-clamp-2">
                {artwork.title[0]}
              </h3>
              
              {/* Show Europeana-specific metadata */}
              {artwork.source === 'europeana' && (
                <div className="mb-3 space-y-2">
                  {artwork.creator && (
                    <p className="text-sm text-gray-600">
                      Creator: {artwork.creator}
                    </p>
                  )}
                  {artwork.country && (
                    <p className="text-sm text-gray-600">
                      Country: {artwork.country}
                    </p>
                  )}
                  {artwork.provider && (
                    <p className="text-sm text-gray-600">
                      Provider: {artwork.provider}
                    </p>
                  )}
                </div>
              )}

              {/* Show additional Rijksmuseum metadata */}
              {artwork.source === 'rijks' && (
                <div className="mb-3 space-y-2">
                  {artwork.created && (
                    <p className="text-sm text-gray-600">
                      Created: {artwork.created}
                    </p>
                  )}
                  {artwork.temporal && (
                    <p className="text-sm text-gray-600">
                      Period: {artwork.temporal}
                    </p>
                  )}
                  {artwork.collection && (
                    <p className="text-sm text-gray-600">
                      Collection: {artwork.collection}
                    </p>
                  )}
                  {artwork.link && (
                    <p className="text-sm text-gray-600">
                      <a 
                        href={artwork.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View in Rijksmuseum
                      </a>
                    </p>
                  )}
                </div>
              )}

<div className="flex flex-wrap gap-2 mb-2">
                {Object.values(artwork.subjects).map((subject, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setSelectedArtwork(artwork)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Updated Artwork Modal */}
        


      {selectedArtwork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-medium mb-1">
                    {selectedArtwork.title[0]}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {selectedArtwork.source === 'wikidata' ? 'Wikidata' : 
                       selectedArtwork.source === 'rijks' ? 'Rijksmuseum' : 'Europeana'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {shouldShowImage(selectedArtwork) && (
                  <div>
                    <img
                      src={selectedArtwork.image || "/api/placeholder/400/300"}
                      alt={selectedArtwork.title[0]}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/300";
                      }}
                    />
                  </div>
                )}
                 <div className="space-y-4">
                  {/* Europeana-specific modal content */}
                  {selectedArtwork.source === 'europeana' && (
                    <>
                      {selectedArtwork.description && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Description</h3>
                          <p className="text-gray-700 text-sm">
                            {selectedArtwork.description}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        {selectedArtwork.creator && (
                          <div>
                            <h4 className="text-sm font-medium">Creator</h4>
                            <p className="text-gray-600 text-sm">{selectedArtwork.creator}</p>
                          </div>
                        )}
                        {selectedArtwork.country && (
                          <div>
                            <h4 className="text-sm font-medium">Country</h4>
                            <p className="text-gray-600 text-sm">{selectedArtwork.country}</p>
                          </div>
                        )}
                        {selectedArtwork.provider && (
                          <div>
                            <h4 className="text-sm font-medium">Provider</h4>
                            <p className="text-gray-600 text-sm">{selectedArtwork.provider}</p>
                          </div>
                        )}
                        {selectedArtwork.language && (
                          <div>
                            <h4 className="text-sm font-medium">Language</h4>
                            <p className="text-gray-600 text-sm">{selectedArtwork.language}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  </div>
                <div className="space-y-4">
                  {selectedArtwork.source === 'rijks' && (
                    <>
                      {selectedArtwork.link && (
                        <div>
                          <a 
                            href={selectedArtwork.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View in Rijksmuseum
                          </a>
                        </div>
                      )}
                      
                      {selectedArtwork.description && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Description</h3>
                          <p className="text-gray-700 text-sm">
                            {selectedArtwork.description}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        {selectedArtwork.created && (
                          <div>
                            <h4 className="text-sm font-medium">Created</h4>
                            <p className="text-gray-600 text-sm">{selectedArtwork.created}</p>
                          </div>
                        )}
                        {selectedArtwork.temporal && (
                          <div>
                            <h4 className="text-sm font-medium">Period</h4>
                            <p className="text-gray-600 text-sm">{selectedArtwork.temporal}</p>
                          </div>
                        )}
                        {selectedArtwork.collection && (
                          <div>
                            <h4 className="text-sm font-medium">Collection</h4>
                            <p className="text-gray-600 text-sm">{selectedArtwork.collection}</p>
                          </div>
                        )}
                        {selectedArtwork.publisher && (
                          <div>
                            <h4 className="text-sm font-medium">Publisher</h4>
                            <p className="text-gray-600 text-sm">{selectedArtwork.publisher}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

{Object.keys(selectedArtwork.subjects).length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Subjects</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(selectedArtwork.subjects).map((subject, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportConceptsVisualization;