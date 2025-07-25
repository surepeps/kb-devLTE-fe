import { NextRequest, NextResponse } from 'next/server';

// Mock testimonials data as fallback
const mockTestimonials = [
  {
    _id: '1',
    fullName: 'Sarah Johnson',
    occupation: 'Real Estate Investor',
    rating: 5,
    message: 'KhabiTeq made finding my dream property so easy. The platform is intuitive and the agent support was exceptional.',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    fullName: 'Michael Chen',
    occupation: 'Business Owner',
    rating: 5,
    message: 'Excellent service! The property marketplace has great listings and the negotiation process was smooth.',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    fullName: 'Aisha Abiola',
    occupation: 'Software Engineer',
    rating: 4,
    message: 'Found my apartment quickly through KhabiTeq. The inspection booking feature saved me so much time.',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    fullName: 'David Thompson',
    occupation: 'Entrepreneur',
    rating: 5,
    message: 'The agent marketplace connected me with a fantastic real estate professional. Highly recommend!',
    status: 'approved',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    // Try to fetch from external API first
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.khabiteq.com';
    
    try {
      const response = await fetch(`${externalApiUrl}/testimonials`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          return NextResponse.json({
            success: true,
            data: data.data.filter((t: any) => t.status === 'approved'),
            source: 'external_api'
          });
        }
      }
    } catch (externalError) {
      console.log('External API not available, using fallback data:', externalError);
    }

    // Return mock data as fallback
    return NextResponse.json({
      success: true,
      data: mockTestimonials,
      source: 'fallback'
    });

  } catch (error) {
    console.error('Error in testimonials API:', error);
    
    return NextResponse.json({
      success: true,
      data: mockTestimonials,
      source: 'error_fallback'
    }, { status: 200 });
  }
}
