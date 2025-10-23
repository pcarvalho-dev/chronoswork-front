'use client';

import { useEffect, useRef, useState } from 'react';

export default function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Animated gradient blobs */}
      <div className="absolute inset-0">
        {/* Blob 1 */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-30 animate-blob"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8), transparent)',
            top: '10%',
            left: '10%',
            animationDelay: '0s',
          }}
        />

        {/* Blob 2 */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-30 animate-blob"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6), transparent)',
            top: '50%',
            right: '10%',
            animationDelay: '2s',
          }}
        />

        {/* Blob 3 */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-30 animate-blob"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent)',
            bottom: '10%',
            left: '30%',
            animationDelay: '4s',
          }}
        />
      </div>

      {/* Mouse follower gradient */}
      {isHovering && (
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20 transition-all duration-300 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.4), transparent)',
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
            transform: 'translate3d(0, 0, 0)',
          }}
        />
      )}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
