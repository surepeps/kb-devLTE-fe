#!/bin/bash

# Fix the upload endpoint in secure negotiations context
sed -i 's/URLS.uploadImg/URLS.uploadFile/g' ./src/context/secure-negotiations-context.tsx

# Fix the uploadFile function to handle different response formats
sed -i 's/return response.data.url;/return response.data?.url || response.url || response.imageUrl || response.data;/g' ./src/context/secure-negotiations-context.tsx

# Fix the error message
sed -i 's/throw new Error("Failed to upload file");/throw new Error(response?.message || "Failed to upload file");/g' ./src/context/secure-negotiations-context.tsx

echo "Upload endpoint fixes applied successfully!"
