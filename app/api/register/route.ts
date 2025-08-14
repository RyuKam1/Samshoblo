import { NextRequest, NextResponse } from 'next/server';
import { addRegistration, RegistrationData } from '@/app/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body: Omit<RegistrationData, 'timestamp' | 'id'> = await request.json();
    
    // Validate required fields
    const requiredFields = ['childName', 'childSurname', 'childAge', 'parentName', 'parentSurname', 'parentPhone'];
    for (const field of requiredFields) {
      if (!body[field as keyof typeof body]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create registration object with timestamp and ID
    const registration: RegistrationData = {
      ...body,
      timestamp: new Date().toISOString(),
      id: generateId()
    };

    // Save registration using shared storage module
    const { success, method, removedCount, totalCount } = await addRegistration(registration);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to save registration. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Registration submitted successfully', 
        id: registration.id,
        storageMethod: method,
        totalRegistrations: totalCount,
        removedCount: removedCount || 0,
        warning: method.includes('memory') ? 'Data stored in memory (will be lost on server restart). Please set up Vercel KV for persistent storage.' : undefined
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}


