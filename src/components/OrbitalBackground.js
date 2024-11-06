import { useState, useEffect } from 'react';

const AnimatedRings = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const rings = [
    { cx: 150, cy: 100, color: "#0085C7", name: "Blue Ring", speed: 1 },
    { cx: 300, cy: 100, color: "#000000", name: "Black Ring", speed: 1.5 },
    { cx: 450, cy: 100, color: "#DF0024", name: "Red Ring", speed: 0.75 },
    { cx: 225, cy: 150, color: "#FFD700", name: "Yellow Ring", speed: 2 },
    { cx: 375, cy: 150, color: "#009F3D", name: "Green Ring", speed: 1.25 }
  ];

  return (
    <div className="w-full h-full">
      <svg viewBox="0 0 600 200" className="w-full h-full">
        {rings.map((ring, index) => (
          <g 
            key={index}
            style={{
              transformOrigin: `${ring.cx}px ${ring.cy}px`,
              animation: mounted ? `spin${index} ${20/ring.speed}s linear infinite` : 'none'
            }}
          >
            <style>
              {`
                @keyframes spin${index} {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}
            </style>
            <circle cx={ring.cx} cy={ring.cy} r="60" fill="none" stroke={ring.color} strokeWidth="2" strokeOpacity="0.1"/>
            <circle cx={ring.cx} cy={ring.cy} r="45" fill="none" stroke={ring.color} strokeWidth="2" strokeOpacity="0.1"/>
            <circle cx={ring.cx} cy={ring.cy} r="30" fill="none" stroke={ring.color} strokeWidth="2" strokeOpacity="0.1"/>
            <circle cx={ring.cx - 20} cy={ring.cy - 40} r="6" fill={ring.color}/>
            <circle cx={ring.cx + 40} cy={ring.cy + 20} r="6" fill={ring.color}/>
            <circle cx={ring.cx - 10} cy={ring.cy + 40} r="6" fill={ring.color}/>
            <circle cx={ring.cx - 40} cy={ring.cy} r="6" fill={ring.color}/>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default AnimatedRings;