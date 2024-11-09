import React, { useState } from 'react';

// Method 1: If your images are in src/assets/representation-bias/
// You would need to import each image like this:
import paralympicImage from '../../assets/representation-bias/paralympic_athlete_entries.png';
import totalParalympicRepresentation from '../../assets/representation-bias/Comparison_athlete_entries.png';
import womanNewspaperImage from '../../assets/representation-bias/WordcloudNewspaperVrouw.png';
import manNewspaperImage from '../../assets/representation-bias/WordcloudNewspapersMan.png';
import blackAthletesImage from '../../assets/representation-bias/WordCloudNewspapersZwart.png';
import whiteAthletesImage from '../../assets/representation-bias/WordcloudNewspapersWit.png';
import fannyImage from '../../assets/representation-bias/WordCloudNewspaperFannyBlankersKkoen.png';
import dukeImage from '../../assets/representation-bias/WordcloudNewspapersKahanamokku.png';

const WordClouds = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const wordCloudData = [
    {
      image: paralympicImage,
     title: 'Female-Focused Sports Coverage in Historical Dutch Newspapers',
      description: 'In sports coverage, female athletes are mostly describes through imagery, relationships and getting chosen.',
    },
    {
      image: totalParalympicRepresentation,
      title:"Difference in the quantities of entries for Olympic Athletes and Paralympic Athletes",
      description: "..."
    },
    {
      image: womanNewspaperImage,
      title: 'Female-Focused Sports Coverage in Historical Dutch Newspapers',
      description: 'In sports coverage, female athletes are mostly describes through imagery, relationships and getting chosen.',
    },
    {
      image: manNewspaperImage,
      title: 'Female-Focused Sports Coverage',
      description: 'In contrast, coverage of male athletes more often focuses on sports achievements. ',
    },
    {
      image: blackAthletesImage,
      title: 'Coverage of Athletes of Colour in Dutch Newspapers',
      description: 'When analyzing sports media coverage of athletes of colour, there is more focus on their athletic achievements and some political issues.',
    },
    {
      image: whiteAthletesImage,
      title: 'Coverage of White Athletes in Dutch Newspapers',
      description: 'Coverage of white athletes is fairly political, focused on apartheid. This may be a relic of our queries as "white" is sometimes considered normative and other groups are mentioned explicitly. Further digging is needed. ',
    },
    {
      image: fannyImage,
      title: 'Dutch Newspapers on Fanny Blankers Koen',
      description: "Coverage of Fanny Blankers-Koen, one of the Netherlands' most successful track athletes, focuses a bit on her achievements but also a lot on her relationships. There is an explicit mention of 'our fellow countrywoman'.",
    },
    {
      image: dukeImage,
      title: 'Dutch Newspapers on Duke Kahanamoku',
      description: 'The coverage of Duke Kahanamoku, Hawaiian swimmer of colour, in Dutch newspapers, focusing on his achievements and the locations in which he competed.',
    },
  ];

  return (
    <div className="bg-white p-8 border-l-4 border-olympic-blue mt-8">
      <h2 className="text-2xl font-light mb-8">Language Analysis in Olympic Coverage</h2>
      
      <div className="space-y-12">
        {wordCloudData.map((item, index) => (
          <div 
            key={index}
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-medium mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
            <div 
              className="bg-gray-50 rounded-lg p-4 flex items-center justify-center cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => setSelectedImage(item)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="max-w-full h-auto rounded shadow-lg"
                onError={(e) => {
                  console.error(`Failed to load image: ${item.image}`);
                  e.target.src = "/api/placeholder/400/300";
                  e.target.alt = "Placeholder - Image not found";
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-medium mb-4">Understanding the Impact</h3>
        <p className="text-gray-600 leading-relaxed">
          These word clouds visualize the stark differences in how male and female athletes are portrayed in media coverage. The analysis spans Olympic coverage from multiple sources, including traditional media, commentary, and social platforms. This persistent language bias can affect public perception and perpetuate gender stereotypes in sports, highlighting the need for more balanced and achievement-focused coverage regardless of gender.
        </p>
      </div>

      {/* Modal for expanded image */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] overflow-auto bg-white rounded-lg p-4">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <div className="space-y-4">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-w-full h-auto mx-auto"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="p-4" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl font-medium mb-2">{selectedImage.title}</h3>
                <p className="text-gray-600">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordClouds;