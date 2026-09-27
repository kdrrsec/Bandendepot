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

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const company = await prisma.company.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: { id: true, email: true, role: true, createdAt: true },
          orderBy: { createdAt: "asc" },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            status: true,
            paymentStatus: true,
            total: true,
            createdAt: true,
            _count: { select: { items: true } },
          },
        },
        _count: { select: { orders: true, prices: true } },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const orderStats = await prisma.order.aggregate({
      where: { companyId: params.id, status: { not: "CANCELLED" } },
      _sum: { total: true },
    });

    return NextResponse.json({
      company,
      stats: {
        orderCount: company._count.orders,
        customPriceCount: company._count.prices,
        totalSpentExVat: orderStats._sum.total || 0,
        lastOrderAt: company.orders[0]?.createdAt ?? null,
      },
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data: {
      status?: string;
      name?: string;
      vatNumber?: string;
      chamberOfCommerce?: string | null;
      contactName?: string;
      phone?: string | null;
    } = {};

    if (body.status !== undefined) {
      if (!["PENDING", "APPROVED", "REJECTED"].includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      data.status = body.status;
    }

    const requiredFields = {
      name: "Bedrijfsnaam",
      vatNumber: "BTW-nummer",
      contactName: "Contactpersoon",
    } as const;

    for (const field of Object.keys(requiredFields) as (keyof typeof requiredFields)[]) {
      if (body[field] !== undefined) {
        const value = String(body[field]).trim();
        if (!value) {
          return NextResponse.json(
            { error: `${requiredFields[field]} is verplicht` },
            { status: 400 }
          );
        }
        data[field] = value;
      }
    }

    for (const field of ["chamberOfCommerce", "phone"] as const) {
      if (body[field] !== undefined) {
        const value = body[field] === null ? "" : String(body[field]).trim();
        data[field] = value || null;
      }
    }

    if (data.vatNumber) {
      const existing = await prisma.company.findUnique({
        where: { vatNumber: data.vatNumber },
      });
      if (existing && existing.id !== params.id) {
        return NextResponse.json(
          { error: "Dit BTW-nummer is al in gebruik" },
          { status: 400 }
        );
      }
    }

    const company = await prisma.company.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
