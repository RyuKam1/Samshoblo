import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

interface RegistrationData {
  childName: string;
  childSurname: string;
  childAge: string;
  parentName: string;
  parentSurname: string;
  parentPhone: string;
  timestamp: string;
  id: string;
}

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

    // Get existing registrations from KV
    let registrations: RegistrationData[] = [];
    try {
      const existingData = await kv.get('registrations');
      registrations = existingData ? JSON.parse(existingData as string) : [];
    } catch (error) {
      console.error('Error reading from KV:', error);
      registrations = [];
    }

    // Add new registration
    registrations.push(registration);

    // Store back to KV
    await kv.set('registrations', JSON.stringify(registrations));

    return NextResponse.json(
      { message: 'Registration submitted successfully', id: registration.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}


