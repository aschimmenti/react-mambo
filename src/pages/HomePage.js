import React from 'react';
import { Link } from 'react-router-dom';
import storyKG from '../stories/StoryKG.json';
import AnimatedRings from '../components/OrbitalBackground';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 md:px-8">
      <h1 className="absolute w-full text-center text-4xl md:text-5xl tracking-wide font-light pt-4 md:pt-8 z-10 left-0">
        Explore Data Stories
      </h1>

      {/* Significantly reduced height and spacing */}
      <div className="flex justify-center items-center w-full h-[250px] md:h-[300px] mt-4">
        <div className="w-full md:w-4/5 lg:w-3/4">
          <AnimatedRings />
        </div>
      </div>

      {/* Reduced top margin for content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {storyKG.stories.map((story) => (
          <div 
            key={story.storyId} 
            className="bg-white border border-gray-200 p-4 md:p-8"
          >
            <h2 className="text-xl md:text-2xl font-light mb-3 md:mb-6 tracking-wide">
              {story.title}
            </h2>
            <p className="text-gray-600 mb-3 md:mb-6 leading-relaxed">
              {story.content.mainText.substring(0, 150)}...
            </p>
            <Link
              to={`/story/${story.storyId}`}
              className="inline-block px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              Read Story
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;