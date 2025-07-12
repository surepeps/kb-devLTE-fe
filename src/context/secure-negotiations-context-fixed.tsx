// ... (keeping all the existing imports and types, just showing the critical uploadFile function)

// File upload method - FIXED to use /upload-file endpoint
const uploadFile = useCallback(async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  // Use POST_REQUEST_FILE_UPLOAD for better file handling
  const response: UploadResponse = await POST_REQUEST_FILE_UPLOAD(
    `${URLS.BASE + URLS.uploadFile}`, // Changed from uploadImg to uploadFile
    formData,
  );

  if (response?.success) {
    // Handle different response formats
    return response.data?.url || response.url || response.imageUrl;
  }
  throw new Error(response?.message || "Failed to upload file");
}, []);

// Export the rest of the context as before...
