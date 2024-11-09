import React from 'react';
import { Link } from 'react-router-dom';

const OrbitalBackground = () => {
  // Clickable stories
  const activeStories = [
    {
      id: "sport-concepts",
      title: "Sports Through the Ages: A Visual Journey",
      color: "#0081C8",
      position: { top: 0, left: 0 }
    },
    {
      id: "Q1890705",
      title: "1968 Olympics Black Power salute",
      color: "#000000",
      position: { top: 0, left: "30%" }
    },
    {
      id: "Q8752",
      title: "Representation Bias",
      color: "#EE334E",
      position: { top: 0, left: "60%" }
    }
  ];

  // Non-linked rings (hover only)
  const decorativeStories = [
    {
      title: "More than Athletes",
      color: "#F4C300",
      position: { top: "25%", left: "15%" }
    },
    {
      title: "Duke Kahanamoku",
      color: "#00A651",
      position: { top: "25%", left: "45%" }
    }
  ];

  return (
    <div className="flex flex-col justify-center items-center h-full text-center">
      <div className="olympic-rings relative z-0 w-[55vw] h-[28vw] max-w-[1600px] max-h-[800px] min-w-[400px] min-h-[220px]">
        {/* Interactive rings with links */}
        {activeStories.map((story) => (
          <Link 
            key={story.id}
            to={`/story/${story.id}`}
            className="ring no-underline absolute w-[22vw] h-[22vw] max-w-[480px] max-h-[480px] min-w-[120px] min-h-[120px] rounded-full border-[6px] cursor-pointer flex justify-center items-center text-[0px] text-white font-bold transition-all duration-300 ease-in-out hover:brightness-160 hover:scale-130 hover:text-[2vw]"
            style={{ 
              '--ring-color': story.color,
              borderColor: story.color,
              top: story.position.top,
              left: story.position.left
            }}
          >
            <span className="font-lora">{story.title}</span>
          </Link>
        ))}

        {/* Non-linked but hoverable rings */}
        {decorativeStories.map((story, index) => (
          <div
            key={`decorative-${index}`}
            className="ring absolute w-[22vw] h-[22vw] max-w-[480px] max-h-[480px] min-w-[120px] min-h-[120px] rounded-full border-[6px] flex justify-center items-center text-[0px] text-white font-bold transition-all duration-300 ease-in-out hover:brightness-160 hover:scale-130 hover:text-[2vw]"
            style={{
              '--ring-color': story.color,
              borderColor: story.color,
              top: story.position.top,
              left: story.position.left
            }}
          >
            <span className="font-lora">{story.title} (TBA)</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .olympic-rings:hover .ring {
          opacity: 0.3;
        }
        
        .ring:hover {
          opacity: 1 !important;
          background-color: var(--ring-color);
          background-color: color-mix(in srgb, var(--ring-color) 70%, transparent);
        }

        @media (max-width: 600px) {
          .ring:hover {
            font-size: 5vw;
          }
        }
      `}</style>
    </div>
  );
};

export default OrbitalBackground;