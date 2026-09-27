"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import FormInput from "@/components/ui/FormInput";
import Alert from "@/components/ui/Alert";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

interface Company {
  id: string;
  name: string;
  vatNumber: string;
  chamberOfCommerce: string | null;
  contactName: string;
  phone: string | null;
  status: string;
}

export default function AccountPage() {
  const { data: session } = useSession();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, [session]);

  const fetchCompany = async () => {
    if (!session?.user?.companyId) return;
    setLoading(true);
    try {
      const response = await fetch("/api/company");
      const data = await response.json();
      setCompany(data);
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Laden...</div>;
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "In behandeling",
      APPROVED: "Goedgekeurd",
      REJECTED: "Afgewezen",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Account</h1>
        <p className="text-gray-600">Beheer uw accountgegevens</p>
      </div>

      {company && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Bedrijfsgegevens
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    company.status
                  )}`}
                >
                  {getStatusLabel(company.status)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrijfsnaam
                </label>
                <p className="text-gray-900">{company.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BTW-nummer
                </label>
                <p className="text-gray-900">{company.vatNumber}</p>
              </div>
              {company.chamberOfCommerce && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KvK-nummer
                  </label>
                  <p className="text-gray-900">{company.chamberOfCommerce}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contactpersoon
                </label>
                <p className="text-gray-900">{company.contactName}</p>
              </div>
              {company.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefoon
                  </label>
                  <p className="text-gray-900">{company.phone}</p>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Gebruikersgegevens
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{session?.user?.email}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {company?.status === "PENDING" && (
        <Alert variant="warning" className="mt-6">
          Je account wordt gecontroleerd. Je ontvangt bericht na goedkeuring.
        </Alert>
      )}
    </div>
  );
}











