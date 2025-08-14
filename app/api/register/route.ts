import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

const dataFilePath = path.join(process.cwd(), 'data', 'registrations.json');

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

    // Ensure data directory exists
    const dataDir = path.dirname(dataFilePath);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Read existing registrations or create empty array
    let registrations: RegistrationData[] = [];
    try {
      const existingData = await fs.readFile(dataFilePath, 'utf-8');
      registrations = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist or is empty, start with empty array
    }

    // Add new registration
    registrations.push(registration);

    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(registrations, null, 2));

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


