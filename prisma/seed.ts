import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Only seed an empty database, so deploys don't recreate deleted data
  if ((await prisma.user.count()) > 0) {
    console.log("Database already contains users, skipping seed.");
    return;
  }

  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || "admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@bandendepot.com" },
    update: {},
    create: {
      email: "admin@bandendepot.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("Created admin user:", adminUser.email);

  // Create test company with approved user
  const testCompanyPassword = await bcrypt.hash(process.env.SEED_TEST_PASSWORD || "test123", 10);
  const testCompany = await prisma.company.upsert({
    where: { vatNumber: "NL123456789B01" },
    update: {},
    create: {
      name: "Test Bandenhandel BV",
      vatNumber: "NL123456789B01",
      chamberOfCommerce: "12345678",
      contactName: "Test Gebruiker",
      phone: "+31 20 123 4567",
      status: "APPROVED",
      users: {
        create: {
          email: "test@bandendepot.com",
          passwordHash: testCompanyPassword,
          role: "USER",
        },
      },
    },
  });

  console.log("Created test company:", testCompany.name);

  // Create brands
  const brands = [
    "Michelin",
    "Bridgestone",
    "Continental",
    "Goodyear",
    "Pirelli",
    "Dunlop",
    "Hankook",
    "Toyo",
    "Yokohama",
    "Nokian",
  ];

  const createdBrands = [];
  for (const brandName of brands) {
    const slug = brandName.toLowerCase().replace(/\s+/g, "-");
    const brand = await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: {
        name: brandName,
        slug,
      },
    });
    createdBrands.push(brand);
    console.log(`Created brand: ${brandName}`);
  }

  // Create products
  const products = [
    // Michelin
    {
      brand: "Michelin",
      width: 205,
      height: 55,
      diameter: 16,
      season: "SUMMER",
      loadIndex: 91,
      speedIndex: "V",
      sku: "MIC-205-55-16-S",
      description: "Premium zomerband met uitstekende grip",
    },
    {
      brand: "Michelin",
      width: 195,
      height: 65,
      diameter: 15,
      season: "WINTER",
      loadIndex: 91,
      speedIndex: "H",
      sku: "MIC-195-65-15-W",
      description: "Betrouwbare winterband",
    },
    {
      brand: "Michelin",
      width: 225,
      height: 45,
      diameter: 17,
      season: "ALL_SEASON",
      loadIndex: 94,
      speedIndex: "W",
      sku: "MIC-225-45-17-AS",
      description: "All-season band voor alle weersomstandigheden",
    },
    // Bridgestone
    {
      brand: "Bridgestone",
      width: 205,
      height: 55,
      diameter: 16,
      season: "SUMMER",
      loadIndex: 91,
      speedIndex: "V",
      sku: "BRI-205-55-16-S",
      description: "Sportieve zomerband",
    },
    {
      brand: "Bridgestone",
      width: 215,
      height: 60,
      diameter: 16,
      season: "WINTER",
      loadIndex: 95,
      speedIndex: "H",
      sku: "BRI-215-60-16-W",
      description: "Premium winterband",
    },
    // Continental
    {
      brand: "Continental",
      width: 205,
      height: 55,
      diameter: 16,
      season: "SUMMER",
      loadIndex: 91,
      speedIndex: "V",
      sku: "CON-205-55-16-S",
      description: "Duitse kwaliteit zomerband",
    },
    {
      brand: "Continental",
      width: 195,
      height: 65,
      diameter: 15,
      season: "ALL_SEASON",
      loadIndex: 91,
      speedIndex: "H",
      sku: "CON-195-65-15-AS",
      description: "All-season band",
    },
    // Goodyear
    {
      brand: "Goodyear",
      width: 225,
      height: 50,
      diameter: 17,
      season: "SUMMER",
      loadIndex: 94,
      speedIndex: "W",
      sku: "GOO-225-50-17-S",
      description: "High-performance zomerband",
    },
    {
      brand: "Goodyear",
      width: 205,
      height: 55,
      diameter: 16,
      season: "WINTER",
      loadIndex: 91,
      speedIndex: "H",
      sku: "GOO-205-55-16-W",
      description: "Betrouwbare winterband",
    },
    // Pirelli
    {
      brand: "Pirelli",
      width: 235,
      height: 45,
      diameter: 18,
      season: "SUMMER",
      loadIndex: 98,
      speedIndex: "Y",
      sku: "PIR-235-45-18-S",
      description: "Sportieve zomerband",
    },
    {
      brand: "Pirelli",
      width: 205,
      height: 55,
      diameter: 16,
      season: "ALL_SEASON",
      loadIndex: 91,
      speedIndex: "V",
      sku: "PIR-205-55-16-AS",
      description: "All-season band",
    },
    // Dunlop
    {
      brand: "Dunlop",
      width: 195,
      height: 65,
      diameter: 15,
      season: "SUMMER",
      loadIndex: 91,
      speedIndex: "H",
      sku: "DUN-195-65-15-S",
      description: "Zomerband",
    },
    {
      brand: "Dunlop",
      width: 215,
      height: 60,
      diameter: 16,
      season: "WINTER",
      loadIndex: 95,
      speedIndex: "H",
      sku: "DUN-215-60-16-W",
      description: "Winterband",
    },
    // Hankook
    {
      brand: "Hankook",
      width: 205,
      height: 55,
      diameter: 16,
      season: "SUMMER",
      loadIndex: 91,
      speedIndex: "V",
      sku: "HAN-205-55-16-S",
      description: "Zomerband",
    },
    {
      brand: "Hankook",
      width: 195,
      height: 65,
      diameter: 15,
      season: "ALL_SEASON",
      loadIndex: 91,
      speedIndex: "H",
      sku: "HAN-195-65-15-AS",
      description: "All-season band",
    },
    // Toyo
    {
      brand: "Toyo",
      width: 225,
      height: 50,
      diameter: 17,
      season: "SUMMER",
      loadIndex: 94,
      speedIndex: "W",
      sku: "TOY-225-50-17-S",
      description: "Zomerband",
    },
    // Yokohama
    {
      brand: "Yokohama",
      width: 205,
      height: 55,
      diameter: 16,
      season: "SUMMER",
      loadIndex: 91,
      speedIndex: "V",
      sku: "YOK-205-55-16-S",
      description: "Zomerband",
    },
    {
      brand: "Yokohama",
      width: 215,
      height: 60,
      diameter: 16,
      season: "WINTER",
      loadIndex: 95,
      speedIndex: "H",
      sku: "YOK-215-60-16-W",
      description: "Winterband",
    },
    // Nokian
    {
      brand: "Nokian",
      width: 195,
      height: 65,
      diameter: 15,
      season: "WINTER",
      loadIndex: 91,
      speedIndex: "H",
      sku: "NOK-195-65-15-W",
      description: "Premium winterband",
    },
    {
      brand: "Nokian",
      width: 205,
      height: 55,
      diameter: 16,
      season: "ALL_SEASON",
      loadIndex: 91,
      speedIndex: "V",
      sku: "NOK-205-55-16-AS",
      description: "All-season band",
    },
  ];

  for (const productData of products) {
    const brand = createdBrands.find((b) => b.name === productData.brand);
    if (!brand) continue;

    const product = await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: {
        brandId: brand.id,
        width: productData.width,
        height: productData.height,
        diameter: productData.diameter,
        season: productData.season,
        loadIndex: productData.loadIndex,
        speedIndex: productData.speedIndex,
        sku: productData.sku,
        description: productData.description,
        inventory: {
          create: {
            stockQty: Math.floor(Math.random() * 100) + 10,
            deliveryDays: Math.floor(Math.random() * 7) + 3,
          },
        },
        prices: {
          create: {
            priceExVat: Math.floor(Math.random() * 100) + 50,
          },
        },
      },
    });
    console.log(`Created product: ${productData.sku}`);
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });







