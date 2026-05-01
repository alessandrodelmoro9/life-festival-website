import { useEffect } from 'react';
import { speakersData } from '@/data/speakersData';

const LIFE25_IMAGES = [
  '/assets/life25/060522.jpg',
  '/assets/life25/06054.jpg',
  '/assets/life25/06058.jpg',
  '/assets/life25/070502.jpg',
  '/assets/life25/070503.jpg',
  '/assets/life25/0705102.jpg',
  '/assets/life25/070519.jpg',
  '/assets/life25/070522.jpg',
  '/assets/life25/070540.jpg',
  '/assets/life25/070549.jpg',
  '/assets/life25/070574.jpg',
  '/assets/life25/070577.jpg',
  '/assets/life25/070584.jpg',
  '/assets/life25/070592.jpg',
  '/assets/life25/070599.jpg'
];

export const useImagePreloader = () => {
  useEffect(() => {
    const imagesToPreload = [
      ...LIFE25_IMAGES,
      ...speakersData.map(s => s.image).filter(Boolean) as string[]
    ];

    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          // Use decode() if supported to move the heavy decoding work off the main thread
          if ('decode' in img) {
            img.decode().then(resolve).catch(resolve);
          } else {
            resolve(null);
          }
        };
        img.onerror = reject;
      });
    };

    // Preload everything quietly in the background
    Promise.all(imagesToPreload.map(preloadImage))
      .then(() => console.log('All critical images preloaded'))
      .catch(err => console.warn('Some images failed to preload', err));
  }, []);
};
