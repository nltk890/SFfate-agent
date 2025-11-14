
import React from 'react';

const Doodle: React.FC<{ className: string; style?: React.CSSProperties }> = ({ className, style }) => {
  return <div className={`absolute rounded-full mix-blend-screen filter ${className}`} style={style}></div>;
};

const Doodles: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-30">
        <Doodle className="bg-cyan-400 w-32 h-32 top-[10%] left-[5%]" style={{ animation: `float 8s ease-in-out infinite` }} />
        <Doodle className="bg-purple-500 w-48 h-48 top-[20%] right-[10%]" style={{ animation: `float 12s ease-in-out infinite 2s` }}/>
        <Doodle className="bg-pink-500 w-24 h-24 bottom-[15%] left-[20%]" style={{ animation: `float 10s ease-in-out infinite 1s` }}/>
        <Doodle className="bg-yellow-400 w-20 h-20 bottom-[10%] right-[15%]" style={{ animation: `float 9s ease-in-out infinite 3s` }}/>
        <style>{`
          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
            100% { transform: translateY(0px) rotate(360deg); }
          }
        `}</style>
    </div>
  );
};

export default Doodles;
