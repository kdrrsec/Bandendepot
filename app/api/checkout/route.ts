import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const { items, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid order items" },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method required" },
        { status: 400 }
      );
    }

    // Calculate total
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const vat = subtotal * 0.21;
    const total = subtotal + vat;

    // Create order with payment information
    const order = await prisma.order.create({
      data: {
        companyId: session.user.companyId,
        status: "PENDING",
        paymentMethod: paymentMethod,
        paymentStatus: "PENDING",
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

    // For demo purposes, we'll simulate payment processing
    // In production, you would integrate with a payment provider like:
    // - Mollie (for iDEAL)
    // - Stripe (for credit cards)
    // - Klarna API

    // Simulate payment URL generation (replace with actual payment provider integration)
    let paymentUrl: string | null = null;

    if (paymentMethod === "ideal") {
      // In production: Create Mollie payment and return checkout URL
      // paymentUrl = await createMolliePayment(order.id, total);
      // For demo: simulate immediate payment
      paymentUrl = null; // Will trigger immediate confirmation
    } else if (paymentMethod === "klarna") {
      // In production: Create Klarna session
      // paymentUrl = await createKlarnaSession(order.id, total);
      paymentUrl = null;
    } else {
      // Credit cards (Amex, Maestro) - could use Stripe
      // paymentUrl = await createStripePayment(order.id, total);
      paymentUrl = null;
    }

    // For demo: If no payment URL, mark as paid immediately
    // In production, you would wait for webhook confirmation
    if (!paymentUrl) {
      // Simulate successful payment for demo
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
        },
      });

      return NextResponse.json({
        orderId: order.id,
        paymentUrl: null,
        message: "Payment processed successfully",
      });
    }

    return NextResponse.json({
      orderId: order.id,
      paymentUrl,
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}





