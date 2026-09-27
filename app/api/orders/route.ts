import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Add runtime config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return empty array if no companyId (e.g., admin users)
    if (!session.user?.companyId) {
      return NextResponse.json({ orders: [] });
    }

    try {
      const orders = await prisma.order.findMany({
        where: { 
          companyId: session.user.companyId 
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  brand: true,
                },
              },
            },
          },
        },
        orderBy: { 
          createdAt: "desc" 
        },
      });

      return NextResponse.json({ orders });
    } catch (dbError: any) {
      console.error("Database error fetching orders:", dbError);
      return NextResponse.json(
        { 
          error: "Database error", 
          message: dbError?.message || "Failed to fetch orders",
          orders: [] 
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in GET /api/orders:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        message: error?.message || "Unknown error",
        orders: []
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if company is approved
    const company = await prisma.company.findUnique({
      where: { id: session.user.companyId },
    });

    if (!company || company.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Company not approved" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order items" },
        { status: 400 }
      );
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const order = await prisma.order.create({
      data: {
        companyId: session.user.companyId,
        status: "PENDING",
        total,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
