import React from 'react';

const WordClouds = () => {
  const wordCloudData = [
    {
      image: '/assets/representation-bias/WordcloudNewspaperVrouw.png',
      title: 'Female-Focused Sports Coverage in Historical Dutch Newspapers',
      description: 'In sports coverage, female athletes are mostly describes through imagery, relationships and getting chosen.',
    },
    {
      image: '/assets/representation-bias/WordcloudNewspapersMan.png',
      title: 'Female-Focused Sports Coverage',
      description: 'In contrast, coverage of male athletes more often focuses on sports achievements. ',
    },
    {
      image: '/assets/representation-bias/WordCloudNewspapersZwart.png',
      title: 'Coverage of Athletes of Colour in Dutch Newspapers',
      description: 'When analyzing sports media coverage of athletes of colour, there is more focus on their athletic achievements and some political issues.',
    },
    {
      image: '/assets/representation-bias/WordcloudNewspapersWit.png',
      title: 'Coverage of White Athletes in Dutch Newspapers',
      description: 'Coverage of white athletes is fairly political, focused on apartheid. This may be a relic of our queries as "white" is sometimes considered normative and other groups are mentioned explicitly. Further digging is needed. ',
    },
    {
      image: '/assets/representation-bias/WordCloudNewspaperFannyBlankersKkoen.png',
      title: 'Dutch Newspapers on Fanny Blankers Koen',
      description: "Coverage of Fanny Blankers-Koen, one of the Netherlands' most successful track athletes, focuses a bit on her achievements but also a lot on her relationships. There is an explicit mention of 'our fellow countrywoman'.",
    },
    {
      image: '/assets/representation-bias/WordcloudNewspapersKahanamokku.png',
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
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.title}
                className="max-w-full h-auto rounded shadow-lg"
                onError={(e) => {
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
    </div>
  );
};

export default WordClouds;