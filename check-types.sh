#!/bin/bash

# Script to check TypeScript types incrementally
echo "Starting TypeScript type checking..."

# First check the essential files
echo "Checking core files..."
npx tsc --noEmit src/app/layout.tsx src/app/page.tsx --skipLibCheck

echo "Checking utils..."
npx tsc --noEmit src/utils/*.ts --skipLibCheck

echo "Checking types..."
npx tsc --noEmit src/types/*.ts --skipLibCheck

echo "Type checking complete."
