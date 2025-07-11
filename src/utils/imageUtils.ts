/** @format */

import randomImage from "@/assets/noImageAvailable.png";

/**
 * Check if an image URL is valid and accessible
 */
export const isValidImageUrl = (url: any): boolean => {
  if (!url) return false;
  if (typeof url !== "string") return false;

  // Check for valid URL patterns
  const urlPattern = /^(https?:\/\/)|(\/)/;
  return urlPattern.test(url);
};

/**
 * Get a safe image URL with fallback
 */
export const getSafeImageUrl = (url: any, fallback?: string): string => {
  if (!url) return fallback || randomImage.src;

  if (typeof url === "string") {
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("www.")) return `https://${url}`;
    if (url.startsWith("/")) return url;
    return fallback || randomImage.src;
  }

  // If it's a StaticImport (local import), return as is
  return url;
};

/**
 * Optimize Cloudinary URL for better performance
 */
export const optimizeCloudinaryUrl = (
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: "auto" | "low" | "high";
    format?: "auto" | "webp" | "jpg" | "png";
  },
): string => {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com"))
    return url;

  const {
    width = 800,
    height = 600,
    quality = "auto:low",
    format = "auto",
  } = options || {};

  try {
    const urlParts = url.split("/upload/");
    if (urlParts.length === 2) {
      const transformations = [
        `f_${format}`, // Auto format
        `q_${quality}`, // Quality
        `w_${width}`, // Max width
        `h_${height}`, // Max height
        "c_limit", // Don't upscale
      ].join(",");

      return `${urlParts[0]}/upload/${transformations}/${urlParts[1]}`;
    }
  } catch (error) {
    console.error("Error optimizing Cloudinary URL:", error);
  }

  return url;
};

/**
 * Check if we should use image optimization based on environment
 */
export const shouldOptimizeImages = (): boolean => {
  // Disable optimization in development to prevent timeout issues
  return process.env.NODE_ENV === "production";
};

/**
 * Get appropriate image component props based on environment
 */
export const getImageProps = (
  src: string,
  options?: {
    priority?: boolean;
    sizes?: string;
    quality?: number;
  },
) => {
  const isCloudinary =
    typeof src === "string" && src?.includes("cloudinary.com");
  const isDev = process.env.NODE_ENV === "development";

  return {
    src,
    unoptimized: isDev && isCloudinary,
    priority: options?.priority || false,
    quality: options?.quality || (isDev ? 75 : 90),
    sizes: options?.sizes,
    loading: options?.priority ? ("eager" as const) : ("lazy" as const),
  };
};
