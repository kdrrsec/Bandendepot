"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Link from "next/link";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { Package, Star, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [companyName, setCompanyName] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.companyId) {
      fetch("/api/company")
        .then((res) => res.json())
        .then((data) => {
          if (data.name) {
            setCompanyName(data.name);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welkom, {companyName || session?.user?.email}
        </h1>
        <p className="text-gray-600">
          Overzicht van uw account en recente activiteit
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Open Bestellingen</p>
              <p className="text-2xl font-bold text-primary">0</p>
            </div>
            <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Favorieten</p>
              <p className="text-2xl font-bold text-primary">0</p>
            </div>
            <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Prijs Updates</p>
              <p className="text-2xl font-bold text-primary">0</p>
            </div>
            <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Snelle Acties
          </h2>
          <div>
            <Link href="/app/catalog" className="block mb-3">
              <ButtonPrimary className="w-full" variant="yellow">
                Bekijk Catalogus
              </ButtonPrimary>
            </Link>
            <Link href="/app/orders" className="block">
              <ButtonPrimary className="w-full" variant="dark">
                Bestellingen Bekijken
              </ButtonPrimary>
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Recente Activiteit
          </h2>
          <p className="text-gray-600">Nog geen recente activiteit</p>
        </Card>
      </div>
    </div>
  );
}







