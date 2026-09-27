import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if company is approved (unless admin)
    if (session.user.role !== "ADMIN") {
      const company = await prisma.company.findUnique({
        where: { id: session.user.companyId || "" },
      });

      if (!company || company.status !== "APPROVED") {
        return NextResponse.json(
          { error: "Company not approved" },
          { status: 403 }
        );
      }
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        brand: true,
        inventory: true,
        prices: {
          where: {
            OR: [
              { companyId: session.user.companyId },
              { companyId: null }, // Base price
            ],
          },
          orderBy: {
            companyId: "desc", // Prefer company-specific price
          },
          take: 1,
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}











