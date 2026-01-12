import { NextRequest, NextResponse } from "next/server";
import {
  addSubscription,
  removeSubscription,
} from "@/app/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const { subscription } = await request.json();

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription data is required" },
        { status: 400 }
      );
    }

    // Add/update subscription using shared module
    const totalSubscriptions = addSubscription(subscription);

    return NextResponse.json(
      {
        message: "Subscription successful",
        totalSubscriptions: totalSubscriptions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint is required" },
        { status: 400 }
      );
    }

    // Remove subscription using shared module
    const totalSubscriptions = removeSubscription(endpoint);

    return NextResponse.json(
      {
        message: "Unsubscription successful",
        totalSubscriptions: totalSubscriptions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unsubscription error:", error);
    return NextResponse.json(
      { error: "Failed to process unsubscription" },
      { status: 500 }
    );
  }
}
