export const processText = (text, storyKG) => {
  // Create a map of all possible entity mentions to their IDs
  const mentionMap = Object.entries(storyKG.entities).reduce((acc, [id, entity]) => {
    // Add the main label
    acc[entity.label.toLowerCase()] = { id, type: entity.type };
    // Add all aliases
    entity.aliases.forEach(alias => {
      acc[alias.toLowerCase()] = { id, type: entity.type };
    });
    return acc;
  }, {});

  // Sort mentions by length (longest first) to handle cases like "Mexico City" before "Mexico"
  const sortedMentions = Object.keys(mentionMap)
    .sort((a, b) => b.length - a.length);

  // Replace mentions with entity links
  let processedText = text;
  let offset = 0;

  // Find all mentions and their positions
  const mentions = [];
  sortedMentions.forEach(mention => {
    const regex = new RegExp(`\\b${mention}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      mentions.push({
        start: match.index,
        end: match.index + mention.length,
        mention,
        ...mentionMap[mention.toLowerCase()]
      });
    }
  });

  // Sort mentions by start position (to process from end to start)
  mentions.sort((a, b) => b.start - a.start);

  // Replace mentions with JSX
  mentions.forEach(({ start, end, mention, id, type }) => {
    const before = processedText.slice(0, start + offset);
    const after = processedText.slice(end + offset);
    const replacement = `<EntityLink id="${id}" type="${type}">${mention}</EntityLink>`;
    processedText = before + replacement + after;
    offset += replacement.length - (end - start);
  });

  return processedText;
};