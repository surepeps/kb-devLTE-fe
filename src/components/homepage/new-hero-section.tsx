/** @format */

'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Button from '../general-components/button';
import Link from 'next/link';
import { useHomePageSettings } from '@/hooks/useSystemSettings';
import useEmblaCarousel from 'embla-carousel-react';

const NewHeroSection = () => {
  const { settings: homePageSettings, loading: settingsLoading } = useHomePageSettings();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps'
  });

  // Video refs for each video in slider
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Get hero video URLs from settings
  const heroVideos = [
    homePageSettings.hero_video_1_url,
    homePageSettings.hero_video_2_url,
  ].filter(Boolean); // Remove empty/null values

  // Carousel navigation
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Video control functions
  const getCurrentVideo = () => videoRefs.current[currentVideoIndex];

  const handlePlayPause = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentVideo = getCurrentVideo();
    if (!currentVideo) return;

    try {
      if (isPlaying) {
        currentVideo.pause();
        setIsPlaying(false);
      } else {
        await currentVideo.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Video control failed:', error);
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const currentVideo = getCurrentVideo();
    if (!currentVideo) return;

    currentVideo.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  // Handle slide selection
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selectedIndex = emblaApi.selectedScrollSnap();
    setCurrentVideoIndex(selectedIndex);

    // Pause all videos
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });

    // Play the current video
    const currentVideo = videoRefs.current[selectedIndex];
    if (currentVideo) {
      currentVideo.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.log('Video play failed:', error);
        setIsPlaying(false);
      });
    }
  }, [emblaApi]);

  // Ensure video autoplay works
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Force play the video after component mounts
      const playVideo = async () => {
        try {
          await video.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Video autoplay failed:', error);
          setIsPlaying(false);
          // Fallback: try again after user interaction
          const handleInteraction = async () => {
            try {
              await video.play();
              setIsPlaying(true);
              document.removeEventListener('click', handleInteraction);
              document.removeEventListener('touchstart', handleInteraction);
            } catch (e) {
              console.log('Video play after interaction failed:', e);
            }
          };
          document.addEventListener('click', handleInteraction);
          document.addEventListener('touchstart', handleInteraction);
        }
      };
      playVideo();
    }
  }, [heroVideoUrl]);
  return (
    <section className='w-full min-h-[100vh] bg-gradient-to-br from-[#0B423D] via-[#093B6D] to-[#0A3E72] flex items-center justify-center overflow-hidden relative'>
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
      
      <div className='container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 relative z-10'>
        <div className='max-w-4xl mx-auto text-center'>
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight font-display'>
            Find the Perfect Property.{' '}
            <span className='text-[#8DDB90]'>Verified</span>,{' '}
            <span className='text-[#8DDB90]'>Hassle-Free</span>.
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 mb-8 sm:mb-10 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0'>
            Khabiteq connects buyers, tenants, developers, and verified agents with speed, transparency, and trust.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-lg mx-auto px-4 sm:px-0'>
            
            {/* Primary CTA */}
            <Link href="/preference" className='w-full sm:w-auto'>
              <Button
                green={true}
                className='w-full sm:w-auto min-h-[48px] sm:min-h-[56px] px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold text-white bg-[#8DDB90] hover:bg-[#7BC87F] transition-all duration-300 transform hover:scale-105 shadow-lg text-center flex items-center justify-center whitespace-nowrap'>
                <span className="block leading-tight">Submit Your Property Preference</span>
              </Button>
            </Link>

            {/* Secondary CTA */}
            <Link href="/market-place" className='w-full sm:w-auto'>
              <Button
                className='w-full sm:w-auto min-h-[48px] sm:min-h-[56px] px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold text-white border-2 border-white hover:bg-white hover:text-[#0B423D] transition-all duration-300 text-center flex items-center justify-center whitespace-nowrap'>
                <span className="block leading-tight">Browse Properties</span>
              </Button>
            </Link>
          </motion.div>

          {/* Hero video with autoplay - only show if video URL is available and valid */}
          {!settingsLoading && heroVideoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className='mt-8 sm:mt-12 md:mt-16 relative px-4 sm:px-0'>
              <div className='bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl mx-auto border border-white/20'>
                <div className='aspect-video bg-gradient-to-br from-white/20 to-white/5 rounded-lg sm:rounded-xl relative overflow-hidden group'>
                  {/* Dynamic video from system settings */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover cursor-pointer"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster="/placeholder-property.svg"
                    onClick={handlePlayPause}
                    onEnded={handleVideoEnded}>
                    <source src={heroVideoUrl} type="video/mp4" />
                    {/* Fallback content if video fails to load */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <div className='w-12 sm:w-16 h-12 sm:h-16 bg-[#8DDB90] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4'>
                          <svg className="w-6 sm:w-8 h-6 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className='text-white/80 text-xs sm:text-sm'>Watch how Khabiteq works</p>
                        <p className='text-white/60 text-xs mt-1'>Property matchmaking in action</p>
                      </div>
                    </div>
                  </video>

                  {/* Video Controls Overlay */}
                  <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
                    {/* Main play/pause button */}
                    <div
                      className='absolute inset-0 flex items-center justify-center cursor-pointer pointer-events-auto'
                      onClick={handlePlayPause}>
                      <div className='w-16 h-16 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200'>
                        {isPlaying ? (
                          // Pause icon
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          // Play icon
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Mute/Unmute button */}
                    <div className='absolute bottom-4 right-4 pointer-events-auto'>
                      <button
                        onClick={handleMuteToggle}
                        className='w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200'>
                        {isMuted ? (
                          // Muted icon
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.792L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.792a1 1 0 011.617-.792zM12.22 6.22a1 1 0 011.414 0L15 7.586l1.364-1.364a1 1 0 111.414 1.414L16.414 9l1.364 1.364a1 1 0 11-1.414 1.414L15 10.414l-1.364 1.364a1 1 0 11-1.414-1.414L13.586 9l-1.364-1.364a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          // Unmuted icon
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.792L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.792a1 1 0 011.617-.792zM12 6a1 1 0 011 1v6a1 1 0 01-2 0V7a1 1 0 011-1zm3-1a1 1 0 000 2 3 3 0 010 6 1 1 0 000 2 5 5 0 000-10z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className='absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    {isPlaying ? 'Playing' : 'Paused'} • Click to {isPlaying ? 'pause' : 'play'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='mt-8 sm:mt-10 md:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-white/60 text-xs sm:text-sm px-4'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-[#8DDB90] rounded-full'></div>
              <span>Verified Properties</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-[#8DDB90] rounded-full'></div>
              <span>Trusted Agents</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-[#8DDB90] rounded-full'></div>
              <span>Secure Transactions</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection;
