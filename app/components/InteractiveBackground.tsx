'use client';

import { useEffect, useState } from 'react';

export default function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastUpdate = 0;
    const throttleMs = 32; // ~30fps for smoother but less resource intensive

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleMs) return;

      lastUpdate = now;
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
      {/* Base gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #e0e7ff 0%, #fce7f3 50%, #ddd6fe 100%)',
        }}
      />

      {/* Animated gradient mesh - large blobs */}
      <div className="absolute inset-0">
        {/* Top left - Blue to Purple */}
        <div
          className="absolute rounded-full blur-3xl opacity-60 animate-blob"
          style={{
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(147, 197, 253, 1) 0%, rgba(196, 181, 253, 0.8) 40%, transparent 70%)',
            top: '-15%',
            left: '-15%',
            animationDelay: '0s',
            animationDuration: '12s',
          }}
        />

        {/* Top right - Pink to Purple */}
        <div
          className="absolute rounded-full blur-3xl opacity-50 animate-blob"
          style={{
            width: '650px',
            height: '650px',
            background: 'radial-gradient(circle, rgba(251, 207, 232, 1) 0%, rgba(221, 214, 254, 0.7) 40%, transparent 70%)',
            top: '-10%',
            right: '-10%',
            animationDelay: '2s',
            animationDuration: '15s',
          }}
        />

        {/* Bottom right - Purple */}
        <div
          className="absolute rounded-full blur-3xl opacity-55 animate-blob"
          style={{
            width: '680px',
            height: '680px',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.9) 0%, rgba(196, 181, 253, 0.6) 40%, transparent 70%)',
            bottom: '-15%',
            right: '5%',
            animationDelay: '4s',
            animationDuration: '18s',
          }}
        />

        {/* Center left - Blue */}
        <div
          className="absolute rounded-full blur-3xl opacity-50 animate-blob"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(191, 219, 254, 1) 0%, rgba(147, 197, 253, 0.7) 40%, transparent 70%)',
            top: '35%',
            left: '-5%',
            animationDelay: '1s',
            animationDuration: '14s',
          }}
        />

        {/* Center - Pink accent */}
        <div
          className="absolute rounded-full blur-3xl opacity-40 animate-blob"
          style={{
            width: '550px',
            height: '550px',
            background: 'radial-gradient(circle, rgba(252, 231, 243, 1) 0%, rgba(251, 207, 232, 0.6) 40%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: '3s',
            animationDuration: '16s',
          }}
        />

        {/* Bottom left - Light purple */}
        <div
          className="absolute rounded-full blur-3xl opacity-45 animate-blob"
          style={{
            width: '620px',
            height: '620px',
            background: 'radial-gradient(circle, rgba(221, 214, 254, 1) 0%, rgba(196, 181, 253, 0.6) 40%, transparent 70%)',
            bottom: '0%',
            left: '-8%',
            animationDelay: '5s',
            animationDuration: '13s',
          }}
        />
      </div>

      {/* Mouse follower - more visible glow */}
      {isHovering && (
        <div
          className="absolute rounded-full blur-3xl opacity-40 transition-all duration-500 ease-out"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.8) 0%, rgba(147, 197, 253, 0.5) 40%, transparent 70%)',
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
            transform: 'translate3d(0, 0, 0)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Subtle overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(255, 255, 255, 0.1) 100%)',
        }}
      />
    </div>
  );
}
