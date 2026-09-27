import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all companies with their orders
    const companies = await prisma.company.findMany({
      include: {
        orders: {
          include: {
            items: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { name: "asc" },
    });

    // Calculate statistics for each company
    const companiesWithStats = companies.map((company) => {
      const totalOrders = company.orders.length;
      const totalRevenue = company.orders.reduce(
        (sum, order) => sum + order.total,
        0
      );
      const pendingOrders = company.orders.filter(
        (o) => o.status === "PENDING" || o.status === "PAID"
      ).length;
      const completedOrders = company.orders.filter(
        (o) => o.status === "COMPLETED"
      ).length;

      return {
        id: company.id,
        name: company.name,
        vatNumber: company.vatNumber,
        contactName: company.contactName,
        status: company.status,
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        latestOrderDate: company.orders[0]?.createdAt || null,
      };
    });

    return NextResponse.json({
      companies: companiesWithStats,
      total: companiesWithStats.length,
    });
  } catch (error) {
    console.error("Error fetching companies with orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
