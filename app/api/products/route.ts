import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (searchParams.get("width")) {
      where.width = parseInt(searchParams.get("width")!);
    }
    if (searchParams.get("height")) {
      where.height = parseInt(searchParams.get("height")!);
    }
    if (searchParams.get("diameter")) {
      where.diameter = parseInt(searchParams.get("diameter")!);
    }
    if (searchParams.get("season")) {
      where.season = searchParams.get("season");
    }
    if (searchParams.get("loadIndex")) {
      where.loadIndex = parseInt(searchParams.get("loadIndex")!);
    }
    if (searchParams.get("speedIndex")) {
      where.speedIndex = searchParams.get("speedIndex");
    }
    if (searchParams.get("brand")) {
      where.brand = {
        slug: searchParams.get("brand")!.toLowerCase(),
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
        skip,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}











