import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_FIREBASE_API_KEY: {
      exists: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      length: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.length || 0,
      isDemo: process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "demo-api-key",
      prefix: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 5) || ""
    },
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: {
      exists: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null
    },
    FIREBASE_PROJECT_ID: {
      exists: !!process.env.FIREBASE_PROJECT_ID,
      value: process.env.FIREBASE_PROJECT_ID || null
    },
    FIREBASE_CLIENT_EMAIL: {
      exists: !!process.env.FIREBASE_CLIENT_EMAIL,
      length: process.env.FIREBASE_CLIENT_EMAIL?.length || 0
    },
    FIREBASE_PRIVATE_KEY: {
      exists: !!process.env.FIREBASE_PRIVATE_KEY,
      length: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      hasNewlines: process.env.FIREBASE_PRIVATE_KEY?.includes("\n") || false,
      hasEscapedNewlines: process.env.FIREBASE_PRIVATE_KEY?.includes("\\n") || false
    },
    CLOUDINARY_CLOUD_NAME: {
      exists: !!process.env.CLOUDINARY_CLOUD_NAME,
      value: process.env.CLOUDINARY_CLOUD_NAME || null
    }
  });
}
