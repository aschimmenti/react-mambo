export const QUERY_TEMPLATES = {
  person: `
    SELECT ?label ?image ?birthDate ?birthPlaceLabel ?deathDate ?occupationLabel ?nationalityLabel
    WHERE {
      wd:%ID% rdfs:label ?label .
      FILTER(LANG(?label) = "en")
      
      OPTIONAL { wd:%ID% wdt:P18 ?image }
      OPTIONAL { wd:%ID% wdt:P569 ?birthDate }
      OPTIONAL {
        wd:%ID% wdt:P19 ?birthPlace .
        ?birthPlace rdfs:label ?birthPlaceLabel .
        FILTER(LANG(?birthPlaceLabel) = "en")
      }
      OPTIONAL { wd:%ID% wdt:P570 ?deathDate }
      OPTIONAL {
        wd:%ID% wdt:P106 ?occupation .
        ?occupation rdfs:label ?occupationLabel .
        FILTER(LANG(?occupationLabel) = "en")
      }
      OPTIONAL {
        wd:%ID% wdt:P27 ?nationality .
        ?nationality rdfs:label ?nationalityLabel .
        FILTER(LANG(?nationalityLabel) = "en")
      }
    }
  `,
  place: `
    SELECT ?label ?image ?countryLabel ?populationCount ?coordinateLocation ?inception
    WHERE {
      wd:%ID% rdfs:label ?label .
      FILTER(LANG(?label) = "en")
      
      OPTIONAL { wd:%ID% wdt:P18 ?image }
      OPTIONAL {
        wd:%ID% wdt:P17 ?country .
        ?country rdfs:label ?countryLabel .
        FILTER(LANG(?countryLabel) = "en")
      }
      OPTIONAL { wd:%ID% wdt:P1082 ?populationCount }
      OPTIONAL { wd:%ID% wdt:P625 ?coordinateLocation }
      OPTIONAL { wd:%ID% wdt:P571 ?inception }
    }
  `,
  country: `
    SELECT ?label ?image ?capital ?population ?continentLabel ?foundingDate ?languageLabel
    WHERE {
      wd:%ID% rdfs:label ?label .
      FILTER(LANG(?label) = "en")
      
      OPTIONAL { wd:%ID% wdt:P18 ?image }
      OPTIONAL { wd:%ID% wdt:P36 ?capital }
      OPTIONAL { wd:%ID% wdt:P1082 ?population }
      OPTIONAL {
        wd:%ID% wdt:P30 ?continent .
        ?continent rdfs:label ?continentLabel .
        FILTER(LANG(?continentLabel) = "en")
      }
      OPTIONAL { wd:%ID% wdt:P571 ?foundingDate }
      OPTIONAL {
        wd:%ID% wdt:P37 ?language .
        ?language rdfs:label ?languageLabel .
        FILTER(LANG(?languageLabel) = "en")
      }
    }
  `
};

export const fetchWikidataEntity = async (entityId, entityType) => {
  try {
    const query = QUERY_TEMPLATES[entityType].replace(/%ID%/g, entityId);
    const response = await fetch('https://query.wikidata.org/sparql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: 'query=' + encodeURIComponent(query),
    });
    
    const result = await response.json();
    return result.results.bindings[0];
  } catch (error) {
    console.error('Error fetching entity data:', error);
    return null;
  }
};