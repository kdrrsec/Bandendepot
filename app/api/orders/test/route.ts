import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json({ 
      test: "OK",
      hasSession: !!session,
      companyId: session?.user?.companyId || null
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error?.message || "Unknown error",
      stack: error?.stack 
    }, { status: 500 });
  }
}
