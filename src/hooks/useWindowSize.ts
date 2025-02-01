"use client";

import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

// Default size to ensure consistent server/client initial render
const defaultSize: WindowSize = {
  width: 1024,
  height: 768
};

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(defaultSize);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Return default size during SSR, actual size after mount
  return hasMounted ? windowSize : defaultSize;
}
