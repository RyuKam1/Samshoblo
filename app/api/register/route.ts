import { NextRequest, NextResponse } from "next/server";
import { addRegistration, RegistrationData } from "@/app/lib/storage";
import { sendNotificationToAll } from "@/app/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const body: Omit<RegistrationData, "timestamp" | "id"> =
      await request.json();

    // Validate required fields
    const requiredFields = [
      "childName",
      "childSurname",
      "childAge",
      "parentName",
      "parentSurname",
      "parentPhone",
    ];
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
      id: generateId(),
    };

    // Save registration using shared storage module
    const { success, method, removedCount, totalCount, isDuplicate } =
      await addRegistration(registration);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to save registration. Please try again." },
        { status: 500 }
      );
    }

    if (isDuplicate) {
      return NextResponse.json(
        {
          message: "Registration already exists for this child and parent.",
          id: registration.id,
          storageMethod: method,
          totalRegistrations: totalCount,
          isDuplicate: true,
          warning:
            "This child is already registered with the same parent contact information.",
        },
        { status: 409 } // Conflict status code
      );
    }

    // Send push notification to admin
    try {
      const notificationTitle = "New Registration Received! 🎉";
      const notificationBody = `${registration.childName} ${registration.childSurname} (${registration.childAge} years old) - Parent: ${registration.parentName} ${registration.parentSurname}`;

      await sendNotificationToAll(notificationTitle, notificationBody, {
        registrationId: registration.id,
        childName: registration.childName,
        childSurname: registration.childSurname,
        childAge: registration.childAge,
        parentName: registration.parentName,
        parentSurname: registration.parentSurname,
        parentPhone: registration.parentPhone,
        timestamp: registration.timestamp,
      });
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
      // Don't fail the registration if notification fails
    }

    return NextResponse.json(
      {
        message: "Registration submitted successfully",
        id: registration.id,
        storageMethod: method,
        totalRegistrations: totalCount,
        removedCount: removedCount || 0,
        isDuplicate: false,
        warning: method.includes("memory")
          ? "Data stored in memory (will be lost on server restart). Please set up Vercel KV for persistent storage."
          : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
