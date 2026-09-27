import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyName,
      vatNumber,
      chamberOfCommerce,
      contactName,
      email,
      password,
      phone,
    } = body;

    // Validate required fields
    if (!companyName || !vatNumber || !contactName || !email || !password) {
      return NextResponse.json(
        { error: "Vul alle verplichte velden in" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Dit emailadres is al geregistreerd" },
        { status: 400 }
      );
    }

    // Check if VAT number already exists
    const existingCompany = await prisma.company.findUnique({
      where: { vatNumber },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "Dit BTW-nummer is al geregistreerd" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create company and user
    const company = await prisma.company.create({
      data: {
        name: companyName,
        vatNumber,
        chamberOfCommerce: chamberOfCommerce || null,
        contactName,
        phone: phone || null,
        status: "PENDING",
        users: {
          create: {
            email,
            passwordHash,
            role: "USER",
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Account aangemaakt. Wacht op goedkeuring.",
        companyId: company.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het aanmaken van het account" },
      { status: 500 }
    );
  }
}











