import { NextRequest, NextResponse } from 'next/server';

// List of external API URLs to try
const API_URLS = [
  process.env.NEXT_PUBLIC_API_URL || 'https://api.khabiteq.com',
  'https://khabiteq-realty.onrender.com/api',
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const fullPath = queryString ? `${path}?${queryString}` : path;

  // Get authorization header from the request
  const authHeader = request.headers.get('authorization');

  for (const baseUrl of API_URLS) {
    try {
      const apiUrl = `${baseUrl}/${fullPath}`;
      console.log(`Trying API URL: ${apiUrl}`);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authHeader) {
        headers.Authorization = authHeader;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(8000), // 8 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        
        return NextResponse.json({
          success: true,
          data: data.data || data,
          message: data.message || 'Request successful',
          source: baseUrl
        });
      }
    } catch (error) {
      console.log(`Failed to fetch from ${baseUrl}:`, error);
      continue; // Try next URL
    }
  }

  // If all APIs fail, return appropriate fallback
  return handleFallback(path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const body = await request.text();
  const authHeader = request.headers.get('authorization');

  for (const baseUrl of API_URLS) {
    try {
      const apiUrl = `${baseUrl}/${path}`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authHeader) {
        headers.Authorization = authHeader;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body,
        signal: AbortSignal.timeout(10000), // 10 second timeout for POST
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch (error) {
      console.log(`POST failed for ${baseUrl}:`, error);
      continue;
    }
  }

  return NextResponse.json({
    success: false,
    error: 'All API endpoints unavailable',
    message: 'Unable to connect to external services'
  }, { status: 503 });
}

function handleFallback(path: string) {
  // Provide fallback data for specific endpoints
  if (path.includes('properties/all')) {
    return NextResponse.json({
      success: true,
      data: [],
      message: 'No properties available at the moment',
      source: 'fallback'
    });
  }

  if (path.includes('agent/all-preferences')) {
    return NextResponse.json({
      success: true,
      data: [],
      message: 'No preferences available',
      source: 'fallback'
    });
  }

  // Generic fallback
  return NextResponse.json({
    success: false,
    error: 'Service temporarily unavailable',
    message: 'External API services are currently unavailable. Please try again later.',
    data: null
  }, { status: 503 });
}
