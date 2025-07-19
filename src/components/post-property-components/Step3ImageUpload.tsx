"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { usePostPropertyContext } from "@/context/post-property-context";
import {
  Plus as PlusIcon,
  X as XIcon,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { POST_REQUEST_FILE_UPLOAD, DELETE_REQUEST } from "@/utils/requests";
import { URLS } from "@/utils/URLS";
import Cookies from "js-cookie";

interface PropertyImage {
  file: File | null;
  preview: string | null;
  id: string;
  url?: string | null; // For uploaded images
  isUploading?: boolean;
}

interface PropertyVideo {
  file: File | null;
  preview: string | null;
  id: string;
  url?: string | null;
  isUploading?: boolean;
}

interface StepProps {
  errors?: any;
  touched?: any;
}

const Step3ImageUpload: React.FC<StepProps> = ({ errors, touched }) => {
  const {
    images,
    setImages,
    getMinimumRequiredImages,
    areImagesValid,
    propertyData,
    updatePropertyData,
  } = usePostPropertyContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Get videos from propertyData or initialize empty array
  const videos: PropertyVideo[] = propertyData.videos || [];

  const setVideos = (newVideos: PropertyVideo[]) => {
    updatePropertyData("videos", newVideos);
  };

  const generateImageId = () => Math.random().toString(36).substr(2, 9);

  const uploadFile = async (file: File, type: "image" | "video" = "image") => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await POST_REQUEST_FILE_UPLOAD(
        `${URLS.BASE}/upload-image`,
        formData,
        Cookies.get("token"),
      );

      if (response?.url) {
        return response.url;
      }
      throw new Error("No URL in response");
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(`Failed to upload ${type}: ${file.name}`);
      return null;
    }
  };

  const removeFile = async (url: string) => {
    try {
      await DELETE_REQUEST(
        `${URLS.BASE}/remove-image`,
        { imageUrl: url },
        Cookies.get("token"),
      );
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file from server");
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const maxImages = 12;
    const currentValidImages = images.filter(
      (img) => img.file !== null || img.url,
    ).length;
    const remainingSlots = maxImages - currentValidImages;

    if (files.length > remainingSlots) {
      toast.error(
        `You can only upload ${remainingSlots} more image(s). Maximum ${maxImages} images allowed.`,
      );
      return;
    }

    const newImages: PropertyImage[] = [];
    const filesToProcess = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    for (const file of filesToProcess) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }

      const reader = new FileReader();
      const preview = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const imageData: PropertyImage = {
        file,
        preview,
        id: generateImageId(),
        isUploading: true,
      };

      newImages.push(imageData);
    }

    if (newImages.length === 0) return;

    // Add images to state first (optimistic update)
    const updatedImages = [...images];
    let newImageIndex = 0;

    for (
      let i = 0;
      i < updatedImages.length && newImageIndex < newImages.length;
      i++
    ) {
      if (updatedImages[i].file === null && !updatedImages[i].url) {
        updatedImages[i] = newImages[newImageIndex];
        newImageIndex++;
      }
    }

    while (
      newImageIndex < newImages.length &&
      updatedImages.length < maxImages
    ) {
      updatedImages.push(newImages[newImageIndex]);
      newImageIndex++;
    }

    while (updatedImages.length < Math.max(4, updatedImages.length)) {
      updatedImages.push({
        file: null,
        preview: null,
        id: generateImageId(),
      });
    }

    setImages(updatedImages);

    // Upload images
    const uploadPromises = newImages.map(async (imageData, index) => {
      if (imageData.file) {
        const url = await uploadFile(imageData.file, "image");
        if (url) {
          // Update the specific image with the URL
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageData.id
                ? { ...img, url, isUploading: false }
                : img,
            ),
          );
        } else {
          // Remove failed upload
          setImages((prev) =>
            prev.map((img) =>
              img.id === imageData.id
                ? { file: null, preview: null, id: generateImageId() }
                : img,
            ),
          );
        }
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleImageRemove = async (indexToRemove: number) => {
    const imageToRemove = images[indexToRemove];

    // If image has URL, remove from server
    if (imageToRemove.url) {
      await removeFile(imageToRemove.url);
    }

    const updatedImages = images.map((img, index) =>
      index === indexToRemove
        ? { file: null, preview: null, id: generateImageId() }
        : img,
    );
    setImages(updatedImages);
  };

  const handleAddMoreImages = () => {
    fileInputRef.current?.click();
  };

  const handleVideoSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Only allow one video
    const maxVideoSize = 50 * 1024 * 1024; // 50MB limit

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      return;
    }

    if (file.size > maxVideoSize) {
      toast.error("Video file is too large. Maximum size is 50MB.");
      return;
    }

    const reader = new FileReader();
    const preview = await new Promise<string>((resolve) => {
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });

    const videoData: PropertyVideo = {
      file,
      preview,
      id: generateImageId(),
      isUploading: true,
    };

    setVideos([videoData]);

    // Upload video
    const url = await uploadFile(file, "video");
    if (url) {
      setVideos([{ ...videoData, url, isUploading: false }]);
      toast.success("Video uploaded successfully!");
    } else {
      setVideos([]);
    }
  };

  const handleVideoRemove = async () => {
    const currentVideo = videos[0];
    if (currentVideo?.url) {
      await removeFile(currentVideo.url);
    }
    setVideos([]);
  };

  const handleAddVideo = () => {
    videoInputRef.current?.click();
  };

  // Initialize with 4 empty slots if no images exist
  React.useEffect(() => {
    if (images.length === 0) {
      const initialImages: PropertyImage[] = [];
      for (let i = 0; i < 4; i++) {
        initialImages.push({
          file: null,
          preview: null,
          id: generateImageId(),
        });
      }
      setImages(initialImages);
    }
  }, []);

  const validImagesCount = images.filter(
    (img) => img.file !== null || img.url,
  ).length;
  const minRequired = getMinimumRequiredImages();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h2 className="text-[24px] leading-[38.4px] font-semibold font-display text-[#09391C] mb-2">
          Upload Picture
        </h2>
        <p className="text-[16px] text-[#5A5D63] mb-4">
          Add high-quality images to showcase your property
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span
            className={`font-medium ${areImagesValid() ? "text-green-600" : "text-red-600"}`}
          >
            {validImagesCount} of {minRequired} minimum images uploaded
          </span>
          {!areImagesValid() && (
            <span className="text-red-600 text-xs">
              (At least {minRequired} images required)
            </span>
          )}
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => handleVideoSelect(e.target.files)}
        className="hidden"
      />

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative aspect-square bg-[#F7F7F8] rounded-md border-2 border-dashed border-[#C7CAD0] hover:border-[#8DDB90] transition-colors group"
          >
            {(image.file && image.preview) || image.url ? (
              <>
                <img
                  src={image.preview || image.url || ""}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {image.isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
                <button
                  onClick={() => handleImageRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  disabled={image.isUploading}
                >
                  <XIcon size={16} />
                </button>
                {index < minRequired && (
                  <div className="absolute bottom-2 left-2 bg-[#8DDB90] text-white text-xs px-2 py-1 rounded">
                    Required
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={handleAddMoreImages}
                className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-[#8DDB90] transition-colors"
              >
                <PlusIcon size={24} className="mb-2" />
                <span className="text-sm">
                  {index < minRequired ? "Required" : "Add Image"}
                </span>
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Video Upload Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-[#09391C] mb-4">
          Upload Video (Optional)
        </h3>
        <p className="text-sm text-[#5A5D63] mb-4">
          Add a video to showcase your property (maximum 1 video, 50MB limit)
        </p>

        {videos.length > 0 && videos[0] ? (
          <div className="relative w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden">
            <video
              src={videos[0].preview || videos[0].url || ""}
              className="w-full h-48 object-cover"
              controls
            />
            {videos[0].isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            <button
              onClick={handleVideoRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              disabled={videos[0].isUploading}
            >
              <XIcon size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={handleAddVideo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
            >
              <VideoIcon size={20} />
              Add Video
            </button>
          </div>
        )}
      </div>

      {/* Add More Images Button */}
      {validImagesCount > 0 && validImagesCount < 12 && (
        <div className="text-center mt-6">
          <button
            onClick={handleAddMoreImages}
            className="bg-[#8DDB90] hover:bg-[#7BC87F] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
          >
            <PlusIcon size={20} />
            Add More Images ({validImagesCount}/12)
          </button>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <ImageIcon size={18} />
          Image Guidelines
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Upload at least {minRequired} high-quality images</li>
          <li>• Maximum file size: 5MB per image, 50MB per video</li>
          <li>
            • Recommended formats: JPG, PNG, WebP for images; MP4, MOV for video
          </li>
          <li>• Include exterior, interior, and key features</li>
          <li>• Maximum {12} images and 1 video allowed</li>
          <li>
            • Images are automatically uploaded and can be removed anytime
          </li>
        </ul>
      </div>

      {/* Validation Message */}
      {!areImagesValid() && validImagesCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-center"
        >
          <p className="text-red-700 font-medium">
            Please upload at least {minRequired - validImagesCount} more
            image(s) to continue
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Step3ImageUpload;
