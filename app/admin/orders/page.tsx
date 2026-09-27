"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Building2, Package, TrendingUp, Clock, CheckCircle } from "lucide-react";

interface CompanyStats {
  id: string;
  name: string;
  vatNumber: string;
  contactName: string;
  status: string;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  latestOrderDate: string | null;
}

export default function AdminOrdersPage() {
  const [companies, setCompanies] = useState<CompanyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/orders/companies");
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies || []);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Geen bestellingen";
    return new Date(dateString).toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCompanyStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getCompanyStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "In behandeling",
      APPROVED: "Goedgekeurd",
      REJECTED: "Afgewezen",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Bestellingen</h1>
          <p className="text-gray-600">Overzicht van alle bestellingen</p>
        </div>
        <Card>
          <p className="text-center text-gray-600 py-8">Laden...</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Bestellingen per Bedrijf</h1>
        <p className="text-gray-600">Overzicht van bestellingen gegroepeerd per bedrijf</p>
      </div>

      {companies.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">
            Er zijn nog geen bedrijven met bestellingen.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {companies.map((company) => (
            <Link key={company.id} href={`/admin/orders/company/${company.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-semibold">{company.name}</h3>
                      <Badge className={getCompanyStatusColor(company.status)}>
                        {getCompanyStatusLabel(company.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      BTW-nummer: {company.vatNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                      Contactpersoon: {company.contactName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(company.totalRevenue * 1.21)}
                    </p>
                    <p className="text-sm text-gray-600">Totaal omzet</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-600">Totaal Bestellingen</p>
                        <p className="text-lg font-bold text-primary">{company.totalOrders}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm text-gray-600">In Behandeling</p>
                        <p className="text-lg font-bold text-yellow-600">{company.pendingOrders}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Afgerond</p>
                        <p className="text-lg font-bold text-green-600">{company.completedOrders}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Laatste Bestelling</p>
                        <p className="text-sm font-semibold">{formatDate(company.latestOrderDate)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-primary mt-4 font-medium text-center">
                    Klik om alle bestellingen van dit bedrijf te bekijken →
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
