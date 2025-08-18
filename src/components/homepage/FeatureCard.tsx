/** @format */

'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface FeatureCardProps {
  feature: {
    id: number;
    title: string;
    description: string;
    videoThumbnail: string;
    videoUrl?: string;
    link: string;
    icon: React.ReactNode;
    color: string;
  };
  index: number;
  loading: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index, loading }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleVideoClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!feature.videoUrl || !videoRef.current) return;

    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
        setHasStarted(true);
      }
    } catch (error) {
      console.log('Video play failed:', error);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  const handleVideoLoadedData = () => {
    // Video is ready to play
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className='group hover:scale-105 transition-transform duration-300'>
      
      <div className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100'>
        
        {/* Video Thumbnail/Preview */}
        <div className='aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-300'>
          {loading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400">Loading...</div>
            </div>
          ) : feature.videoUrl ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover cursor-pointer"
                muted
                poster={feature.videoThumbnail}
                preload="metadata"
                onClick={handleVideoClick}
                onEnded={handleVideoEnded}
                onLoadedData={handleVideoLoadedData}>
                <source src={feature.videoUrl} type="video/mp4" />
                <img
                  src={feature.videoThumbnail}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
              </video>
              
              {/* Play/Pause button overlay */}
              <div 
                className='absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300 cursor-pointer'
                onClick={handleVideoClick}>
                <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {isPlaying ? (
                    // Pause icon
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    // Play icon
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Video indicator for better UX */}
              {hasStarted && (
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {isPlaying ? 'Playing' : 'Paused'}
                </div>
              )}
            </>
          ) : (
            <img
              src={feature.videoThumbnail}
              alt={feature.title}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Loading state for play button */}
          {loading && (
            <div className='absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300'>
              <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {feature.icon}
        </div>

        {/* Title */}
        <h3 className='text-xl md:text-2xl font-bold text-[#09391C] mb-3 group-hover:text-[#8DDB90] transition-colors duration-300'>
          {feature.title}
        </h3>

        {/* Description */}
        <p className='text-gray-600 leading-relaxed mb-4'>
          {feature.description}
        </p>

        {/* Link/Button */}
        <Link href={feature.link}>
          <div className='flex items-center gap-2 text-[#8DDB90] hover:text-[#7BC87F] transition-colors duration-300 cursor-pointer'>
            <span className='font-medium'>Learn More</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
