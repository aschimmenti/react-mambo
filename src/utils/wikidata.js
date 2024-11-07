export const BASE_QUERY = `
  SELECT ?label ?description ?wikipediaUrl ?image ?typeLabel
  WHERE {
    wd:%ID% rdfs:label ?label .
    FILTER(LANG(?label) = "en")
    
    OPTIONAL {
      wd:%ID% schema:description ?description .
      FILTER(LANG(?description) = "en")
    }
    
    OPTIONAL {
      wd:%ID% wdt:P18 ?image
    }
    
    OPTIONAL {
      wd:%ID% wdt:P31 ?type .
      ?type rdfs:label ?typeLabel .
      FILTER(LANG(?typeLabel) = "en")
    }
    
    OPTIONAL {
      ?wikipediaUrl schema:about wd:%ID% ;
                    schema:isPartOf <https://en.wikipedia.org/> .
    }
  }
  LIMIT 1
`;

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
  `,
  organization: `
    SELECT ?label ?image ?inceptionDate ?headquartersLabel ?typeLabel ?parentOrgLabel ?websiteUrl
    WHERE {
      wd:%ID% rdfs:label ?label .
      FILTER(LANG(?label) = "en")
      
      OPTIONAL { wd:%ID% wdt:P18 ?image }
      OPTIONAL { wd:%ID% wdt:P571 ?inceptionDate }
      OPTIONAL {
        wd:%ID% wdt:P159 ?headquarters .
        ?headquarters rdfs:label ?headquartersLabel .
        FILTER(LANG(?headquartersLabel) = "en")
      }
      OPTIONAL {
        wd:%ID% wdt:P31 ?type .
        ?type rdfs:label ?typeLabel .
        FILTER(LANG(?typeLabel) = "en")
      }
      OPTIONAL {
        wd:%ID% wdt:P749 ?parentOrg .
        ?parentOrg rdfs:label ?parentOrgLabel .
        FILTER(LANG(?parentOrgLabel) = "en")
      }
      OPTIONAL { wd:%ID% wdt:P856 ?websiteUrl }
    }
  `,
  educational_institution: `
    SELECT ?label ?image ?inceptionDate ?locationLabel ?studentCount ?facultyCount ?mottoLabel
    WHERE {
      wd:%ID% rdfs:label ?label .
      FILTER(LANG(?label) = "en")
      
      OPTIONAL { wd:%ID% wdt:P18 ?image }
      OPTIONAL { wd:%ID% wdt:P571 ?inceptionDate }
      OPTIONAL {
        wd:%ID% wdt:P276 ?location .
        ?location rdfs:label ?locationLabel .
        FILTER(LANG(?locationLabel) = "en")
      }
      OPTIONAL { wd:%ID% wdt:P2196 ?studentCount }
      OPTIONAL { wd:%ID% wdt:P1612 ?facultyCount }
      OPTIONAL {
        wd:%ID% wdt:P1451 ?motto .
        ?motto rdfs:label ?mottoLabel .
        FILTER(LANG(?mottoLabel) = "en")
      }
    }
  `,
  sports_organization: `
    SELECT ?label ?image ?inceptionDate ?headquartersLabel ?presidentLabel ?sportLabel ?memberCount
    WHERE {
      wd:%ID% rdfs:label ?label .
      FILTER(LANG(?label) = "en")
      
      OPTIONAL { wd:%ID% wdt:P18 ?image }
      OPTIONAL { wd:%ID% wdt:P571 ?inceptionDate }
      OPTIONAL {
        wd:%ID% wdt:P159 ?headquarters .
        ?headquarters rdfs:label ?headquartersLabel .
        FILTER(LANG(?headquartersLabel) = "en")
      }
      OPTIONAL {
        wd:%ID% wdt:P488 ?president .
        ?president rdfs:label ?presidentLabel .
        FILTER(LANG(?presidentLabel) = "en")
      }
      OPTIONAL {
        wd:%ID% wdt:P641 ?sport .
        ?sport rdfs:label ?sportLabel .
        FILTER(LANG(?sportLabel) = "en")
      }
      OPTIONAL { wd:%ID% wdt:P2124 ?memberCount }
    }
  `,
  governing_body: `
    SELECT ?label ?image ?inceptionDate ?jurisdictionLabel ?headLabel ?headquartersLabel ?typeLabel
    WHERE {
      wd:%ID% rdfs:label ?label .
      FILTER(LANG(?label) = "en")
      
      OPTIONAL { wd:%ID% wdt:P18 ?image }
      OPTIONAL { wd:%ID% wdt:P571 ?inceptionDate }
      OPTIONAL {
        wd:%ID% wdt:P1001 ?jurisdiction .
        ?jurisdiction rdfs:label ?jurisdictionLabel .
        FILTER(LANG(?jurisdictionLabel) = "en")
      }
      OPTIONAL {
        wd:%ID% wdt:P35 ?head .
        ?head rdfs:label ?headLabel .
        FILTER(LANG(?headLabel) = "en")
      }
      OPTIONAL {
        wd:%ID% wdt:P159 ?headquarters .
        ?headquarters rdfs:label ?headquartersLabel .
        FILTER(LANG(?headquartersLabel) = "en")
      }
      OPTIONAL {
        wd:%ID% wdt:P31 ?type .
        ?type rdfs:label ?typeLabel .
        FILTER(LANG(?typeLabel) = "en")
      }
    }
  `
};

export const fetchWikidataEntity = async (entityId, entityType = null) => {
  try {
    // Use base query if no specific type is provided
    const query = entityType ? 
      QUERY_TEMPLATES[entityType].replace(/%ID%/g, entityId) :
      BASE_QUERY.replace(/%ID%/g, entityId);

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