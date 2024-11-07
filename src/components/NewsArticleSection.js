import React from 'react';
import { Card } from './Card';

const NewsArticleSection = ({ articles, entities, onEntityClick }) => {
  const processTextToComponents = (text, entities) => {
    const mentionMap = Object.entries(entities).reduce((acc, [id, entity]) => {
      acc.push({
        text: entity.label,
        id,
        type: entity.type,
        priority: 2
      });
      entity.aliases?.forEach(alias => {
        acc.push({
          text: alias,
          id,
          type: entity.type,
          priority: 1
        });
      });
      return acc;
    }, []);

    const sortedMentions = mentionMap.sort((a, b) => {
      const lengthDiff = b.text.length - a.text.length;
      return lengthDiff !== 0 ? lengthDiff : b.priority - a.priority;
    });

    let processedText = text;
    const replacements = [];
    const usedRanges = [];

    sortedMentions.forEach(mention => {
      const regex = new RegExp(`\\b${mention.text}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(processedText)) !== null) {
        const start = match.index;
        const end = start + mention.text.length;
        
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

    replacements.sort((a, b) => a.start - b.start);

    const result = [];
    let lastIndex = 0;

    replacements.forEach((replacement, index) => {
      if (replacement.start > lastIndex) {
        result.push({
          type: 'text',
          content: processedText.slice(lastIndex, replacement.start)
        });
      }

      result.push({
        type: 'entity',
        content: replacement.text,
        id: replacement.id,
        entityType: replacement.type
      });

      lastIndex = replacement.end;
    });

    if (lastIndex < processedText.length) {
      result.push({
        type: 'text',
        content: processedText.slice(lastIndex)
      });
    }

    return result;
  };

  const renderProcessedContent = (processedArray) => {
    return processedArray.map((item, index) => {
      if (item.type === 'entity') {
        return (
          <button
            key={`entity-${index}`}
            onClick={() => onEntityClick({ id: item.id, type: item.entityType })}
            className="btn btn-link p-0 text-decoration-none entity-link inline-flex items-center"
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
            {item.content}
          </button>
        );
      }
      return <span key={`text-${index}`} className="inline">{item.content}</span>;
    });
  };

  const extractTextContent = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.textContent || '';
  };

  const renderArticleContent = (article) => {
    const htmlContent = article.article.find(a => a.format === "html");
    
    if (!htmlContent || !htmlContent.source) {
      return null;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent.source, 'text/html');
    const contentNodes = Array.from(doc.querySelectorAll('article > *'));

    return (
      <div className="prose prose-lg max-w-none">
        {contentNodes.map((node, index) => {
          const tagName = node.tagName.toLowerCase();
          const textContent = extractTextContent(node.outerHTML);
          const processedContent = renderProcessedContent(processTextToComponents(textContent, entities));

          switch (tagName) {
            case 'h1':
              return <h1 key={index} className="text-3xl font-light mb-6">{processedContent}</h1>;
            case 'blockquote':
              return (
                <blockquote key={index} className="border-l-4 border-gray-300 pl-4 my-4 italic">
                  {processedContent}
                </blockquote>
              );
            case 'p':
            default:
              return <p key={index} className="mb-4">{processedContent}</p>;
          }
        })}
      </div>
    );
  };

  return (
    <div className="mt-12 space-y-8">
      {articles.map((article, index) => (
        <Card 
          key={index} 
          className="border-l-4 border-olympic-blue bg-gray-50"
        >
          {/* Article Metadata Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <h3 className="text-2xl font-light mb-2">{article.title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {article.date && (
                <div>
                  <span className="font-medium">Date:</span>{' '}
                  {article.date}
                </div>
              )}
              {article.creator?.label && (
                <div>
                  <span className="font-medium">Author:</span>{' '}
                  {article.creator.label}
                </div>
              )}
              {article.publisher?.label && (
                <div>
                  <span className="font-medium">Publisher:</span>{' '}
                  {article.publisher.label}
                </div>
              )}
            </div>
          </div>
          
          {/* Article Content */}
          <div className="p-6">
            {renderArticleContent(article)}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default NewsArticleSection;