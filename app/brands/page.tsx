"use client";

import PublicLayout from "@/components/layouts/PublicLayout";
import Card from "@/components/ui/Card";
import BrandLogo from "@/components/ui/BrandLogo";
import { brands } from "@/config/brands";

export default function BrandsPage() {
  return (
    <PublicLayout>
      <div className="bg-neutral-light py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Merken</h1>
            <p className="text-lg text-gray-600">
              Wij werken met meer dan 300 merken. Hieronder vindt u een selectie
              van onze populairste merken.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {brands.map((brand) => (
              <Card key={brand.slug} className="text-center p-6 flex items-center justify-center min-h-[120px]">
                <BrandLogo
                  name={brand.name}
                  slug={brand.slug}
                  logoSrc={brand.logo}
                />
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Registreer om toegang te krijgen tot alle merken en prijzen
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}







