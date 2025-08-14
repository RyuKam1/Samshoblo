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
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'georgian2024'; // Change this in production

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Read registrations from file
    let registrations: RegistrationData[] = [];
    try {
      const existingData = await fs.readFile(dataFilePath, 'utf-8');
      registrations = JSON.parse(existingData);
    } catch (error) {
      // File doesn't exist or is empty, return empty array
    }

    // Sort by timestamp (newest first)
    registrations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


