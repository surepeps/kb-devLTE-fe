// Simple test to verify our type fixes work
import { Property } from './src/types/property.types';
import { BriefType } from './src/types/index.tsx';

// Test that our types are properly defined
const testProperty: Property = {
  id: 'test',
  title: 'Test Property',
  description: 'Test Description',
  type: 'residential',
  category: 'sale',
  status: 'available',
  price: {
    amount: 100000,
    currency: 'NGN',
    negotiable: true
  },
  location: {
    state: 'Lagos',
    lga: 'Ikeja'
  },
  features: {},
  images: [],
  documents: [],
  owner: {
    id: 'owner1',
    name: 'Test Owner',
    email: 'owner@test.com',
    phone: '1234567890',
    verified: true
  },
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  views: 0,
  likes: 0,
  verified: true,
  featured: false
};

console.log('Type test passed!');
