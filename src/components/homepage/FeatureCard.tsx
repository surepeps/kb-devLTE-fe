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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitEnterFullscreen) {
        (videoRef.current as any).webkitEnterFullscreen();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group hover:scale-105 transition-transform duration-300"
    >
      <Link href={feature.link}>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer">
          {/* Video Thumbnail/Preview */}
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
            {loading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
              </div>
            ) : feature.videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={feature.videoThumbnail}
                preload="metadata"
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                controls={false} // custom controls only
              >
                <source src={feature.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <img
                src={feature.videoThumbnail}
                alt={feature.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Overlay Controls */}
            {feature.videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                {!isPlaying && !loading && (
                  <button
                    onClick={handlePlayPause}
                    className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}

                {isPlaying && (
                  <button
                    onClick={handlePlayPause}
                    className="absolute bottom-4 left-4 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6 4h2v12H6V4zm6 0h2v12h-2V4z" />
                    </svg>
                  </button>
                )}

                <button
                  onClick={handleFullscreen}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 3h6v2H5v4H3V3zm14 0h-6v2h4v4h2V3zm-6 14h6v-6h-2v4h-4v2zM3 17h6v-2H5v-4H3v6z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Icon */}
          <div
            className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            {feature.icon}
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-bold text-[#09391C] mb-3 group-hover:text-[#8DDB90] transition-colors duration-300">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-4">
            {feature.description}
          </p>

          {/* Link/Button */}
          <div className="flex items-center gap-2 text-[#8DDB90] group-hover:text-[#7BC87F] transition-colors duration-300">
            <span className="font-medium">Learn More</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default FeatureCard;
