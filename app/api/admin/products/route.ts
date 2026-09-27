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

    const products = await prisma.product.findMany({
      include: {
        brand: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      products,
      total: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    
    // Check if this is a bulk import (array of products)
    if (Array.isArray(body.products)) {
      return handleBulkImport(body.products);
    }

    // Single product creation (existing logic)
    const {
      brandId,
      width,
      height,
      diameter,
      season,
      loadIndex,
      speedIndex,
      sku,
      description,
    } = body;

    if (
      !brandId ||
      !width ||
      !height ||
      !diameter ||
      !season ||
      !loadIndex ||
      !speedIndex ||
      !sku
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        brandId,
        width: parseInt(width),
        height: parseInt(height),
        diameter: parseInt(diameter),
        season,
        loadIndex: parseInt(loadIndex),
        speedIndex,
        sku,
        description: description || null,
        inventory: {
          create: {
            stockQty: 0,
            deliveryDays: 7,
          },
        },
        prices: {
          create: {
            priceExVat: 0,
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 400 }
      );
    }
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleBulkImport(products: any[]) {
  const results = {
    success: [] as any[],
    errors: [] as { index: number; sku: string; error: string }[],
  };

  for (let i = 0; i < products.length; i++) {
    const productData = products[i];
    const {
      brandId,
      width,
      height,
      diameter,
      season,
      loadIndex,
      speedIndex,
      sku,
      description,
      stockQty = 0,
      deliveryDays = 7,
      priceExVat = 0,
    } = productData;

    // Validate required fields
    if (
      !brandId ||
      !width ||
      !height ||
      !diameter ||
      !season ||
      !loadIndex ||
      !speedIndex ||
      !sku
    ) {
      results.errors.push({
        index: i,
        sku: sku || "N/A",
        error: "Missing required fields",
      });
      continue;
    }

    try {
      const product = await prisma.product.create({
        data: {
          brandId,
          width: parseInt(width),
          height: parseInt(height),
          diameter: parseInt(diameter),
          season,
          loadIndex: parseInt(loadIndex),
          speedIndex,
          sku,
          description: description || null,
          inventory: {
            create: {
              stockQty: parseInt(stockQty) || 0,
              deliveryDays: parseInt(deliveryDays) || 7,
            },
          },
          prices: {
            create: {
              priceExVat: parseFloat(priceExVat) || 0,
            },
          },
        },
      });
      results.success.push(product);
    } catch (error: any) {
      if (error.code === "P2002") {
        results.errors.push({
          index: i,
          sku,
          error: "SKU already exists",
        });
      } else {
        results.errors.push({
          index: i,
          sku,
          error: error.message || "Unknown error",
        });
      }
    }
  }

  return NextResponse.json(
    {
      success: results.success.length,
      errors: results.errors.length,
      total: products.length,
      details: results,
    },
    { status: results.success.length > 0 ? 201 : 400 }
  );
}











