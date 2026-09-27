"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Card from "@/components/ui/Card";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";

interface Company {
  id: string;
  name: string;
  vatNumber: string;
  contactName: string;
  status: string;
  createdAt: string;
  _count: { users: number; orders: number };
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/companies");
      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyStatus = async (companyId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setSuccessMessage(
          status === "APPROVED" 
            ? "Bedrijf is goedgekeurd!" 
            : "Bedrijf is afgewezen."
        );
        setTimeout(() => setSuccessMessage(""), 3000);
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error updating company status:", error);
    }
  };

  const searchTerm = search.trim().toLowerCase();
  const filteredCompanies = companies
    .filter((c) => filter === "ALL" || c.status === filter)
    .filter(
      (c) =>
        !searchTerm ||
        [c.name, c.vatNumber, c.contactName].some((value) =>
          value.toLowerCase().includes(searchTerm)
        )
    );

  const pendingCount = companies.filter((c) => c.status === "PENDING").length;

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

  if (loading) {
    return <div className="text-center py-12">Laden...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Bedrijven</h1>
        <p className="text-gray-600">Beheer bedrijfsaccounts en keur nieuwe registraties goed</p>
      </div>

      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === "ALL"
              ? "bg-primary text-white"
              : "bg-white text-primary border-2 border-primary"
          }`}
        >
          Alle ({companies.length})
        </button>
        <button
          onClick={() => setFilter("PENDING")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors relative ${
            filter === "PENDING"
              ? "bg-yellow-500 text-white"
              : "bg-white text-yellow-800 border-2 border-yellow-500"
          }`}
        >
          In Behandeling ({pendingCount})
          {pendingCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilter("APPROVED")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === "APPROVED"
              ? "bg-green-500 text-white"
              : "bg-white text-green-800 border-2 border-green-500"
          }`}
        >
          Goedgekeurd ({companies.filter((c) => c.status === "APPROVED").length})
        </button>
        <button
          onClick={() => setFilter("REJECTED")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === "REJECTED"
              ? "bg-red-500 text-white"
              : "bg-white text-red-800 border-2 border-red-500"
          }`}
        >
          Afgewezen ({companies.filter((c) => c.status === "REJECTED").length})
        </button>
      </div>

      <div className="mb-4 relative max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Zoek op naam, BTW-nummer of contactpersoon"
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Bedrijfsnaam</th>
                <th className="text-left p-4">BTW-nummer</th>
                <th className="text-left p-4">Contactpersoon</th>
                <th className="text-left p-4">Gebruikers</th>
                <th className="text-left p-4">Bestellingen</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Datum</th>
                <th className="text-left p-4">Acties</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    {searchTerm
                      ? "Geen bedrijven gevonden voor deze zoekopdracht"
                      : filter === "PENDING" 
                      ? "Geen bedrijven in behandeling" 
                      : filter === "ALL"
                      ? "Geen bedrijven gevonden"
                      : `Geen ${filter === "APPROVED" ? "goedgekeurde" : "afgewezen"} bedrijven`}
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company) => (
                <tr
                  key={company.id}
                  onClick={() => router.push(`/admin/companies/${company.id}`)}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-semibold text-primary">{company.name}</td>
                  <td className="p-4">{company.vatNumber}</td>
                  <td className="p-4">{company.contactName}</td>
                  <td className="p-4">{company._count.users}</td>
                  <td className="p-4">{company._count.orders}</td>
                  <td className="p-4">
                    <Badge className={getStatusColor(company.status)}>
                      {getStatusLabel(company.status)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    {new Date(company.createdAt).toLocaleDateString("nl-NL")}
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2 items-center">
                      {company.status === "PENDING" && (
                        <>
                          <ButtonPrimary
                            variant="dark"
                            className="!px-3 !py-1 text-sm"
                            onClick={() =>
                              updateCompanyStatus(company.id, "APPROVED")
                            }
                          >
                            Goedkeuren
                          </ButtonPrimary>
                          <ButtonPrimary
                            variant="yellow"
                            className="!px-3 !py-1 text-sm"
                            onClick={() =>
                              updateCompanyStatus(company.id, "REJECTED")
                            }
                          >
                            Afwijzen
                          </ButtonPrimary>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}







