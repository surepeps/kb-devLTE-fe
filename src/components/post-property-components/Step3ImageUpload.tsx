"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { usePostPropertyContext } from "@/context/post-property-context";
import { Plus as PlusIcon, X as XIcon, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface PropertyImage {
  file: File | null;
  preview: string | null;
  id: string;
}

const Step3ImageUpload: React.FC = () => {
  const { images, setImages, getMinimumRequiredImages, areImagesValid } =
    usePostPropertyContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateImageId = () => Math.random().toString(36).substr(2, 9);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const maxImages = 12;
    const currentValidImages = images.filter((img) => img.file !== null).length;
    const remainingSlots = maxImages - currentValidImages;

    if (files.length > remainingSlots) {
      toast.error(
        `You can only upload ${remainingSlots} more image(s). Maximum ${maxImages} images allowed.`,
      );
      return;
    }

    const newImages: PropertyImage[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          toast.error(`${file.name} is too large. Maximum size is 5MB.`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          newImages.push({
            file,
            preview,
            id: generateImageId(),
          });

          if (
            newImages.length ===
            Array.from(files).filter((f) => f.type.startsWith("image/")).length
          ) {
            // Find empty slots and fill them
            const updatedImages = [...images];
            let newImageIndex = 0;

            for (
              let i = 0;
              i < updatedImages.length && newImageIndex < newImages.length;
              i++
            ) {
              if (updatedImages[i].file === null) {
                updatedImages[i] = newImages[newImageIndex];
                newImageIndex++;
              }
            }

            // Add remaining images as new slots
            while (
              newImageIndex < newImages.length &&
              updatedImages.length < maxImages
            ) {
              updatedImages.push(newImages[newImageIndex]);
              newImageIndex++;
            }

            // Ensure we have at least 4 slots
            while (updatedImages.length < Math.max(4, updatedImages.length)) {
              updatedImages.push({
                file: null,
                preview: null,
                id: generateImageId(),
              });
            }

            setImages(updatedImages);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error(`${file.name} is not a valid image file.`);
      }
    });
  };

  const handleImageRemove = (indexToRemove: number) => {
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

  const validImagesCount = images.filter((img) => img.file !== null).length;
  const minRequired = getMinimumRequiredImages();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#09391C] font-display mb-4">
          Upload Property Images
        </h2>
        <p className="text-[#5A5D63] text-lg mb-4">
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
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
            className="relative aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#8DDB90] transition-colors group"
          >
            {image.file && image.preview ? (
              <>
                <img
                  src={image.preview}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => handleImageRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
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

      {/* Add More Button */}
      {validImagesCount > 0 && validImagesCount < 12 && (
        <div className="text-center">
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
          <li>• Maximum file size: 5MB per image</li>
          <li>• Recommended formats: JPG, PNG, WebP</li>
          <li>• Include exterior, interior, and key features</li>
          <li>• Maximum {12} images allowed</li>
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
