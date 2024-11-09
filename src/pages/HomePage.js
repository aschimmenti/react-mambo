import React from 'react';
import { Link } from 'react-router-dom';
import storyKG from '../stories/StoryKG.json';
import AnimatedRings from '../components/OrbitalBackground';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 md:px-8">
      {/* Increased z-index and moved title outside the main container */}
      <div className="w-full flex justify-center z-[100] pt-8 md:pt-12">
        <h1 className="text-4xl md:text-6xl tracking-widest font-extralight text-center font-mono">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-black to-red-600">
            LODLYMPICS
          </span>
        </h1>
      </div>

      {/* Rings section with lower z-index */}
      <div className="relative z-0 flex justify-center items-center w-full h-[450px] md:h-[600px] mt-20">
        <div className="w-full md:w-[90%] lg:w-[85%]">
          <AnimatedRings />
        </div>
      </div>

      <div className="mt-20 md:mt-32">
        <h2 className="text-2xl md:text-3xl text-center font-light mb-12 tracking-wide">
          5 LOD-driven data stories about sports and the Olympics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
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
                className="inline-block px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 no-underline"
              >
                Read Story
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;