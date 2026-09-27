"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Alert from "@/components/ui/Alert";
import FormInput from "@/components/ui/FormInput";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import {
  ArrowLeft,
  Building2,
  Package,
  Euro,
  Users,
  Tag,
  Pencil,
} from "lucide-react";

interface CompanyDetail {
  id: string;
  name: string;
  vatNumber: string;
  chamberOfCommerce: string | null;
  contactName: string;
  phone: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  users: { id: string; email: string; role: string; createdAt: string }[];
  orders: {
    id: string;
    status: string;
    paymentStatus: string | null;
    total: number;
    createdAt: string;
    _count: { items: number };
  }[];
}

interface Stats {
  orderCount: number;
  customPriceCount: number;
  totalSpentExVat: number;
  lastOrderAt: string | null;
}

const companyStatusLabels: Record<string, string> = {
  PENDING: "In behandeling",
  APPROVED: "Goedgekeurd",
  REJECTED: "Afgewezen",
};

const companyStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const orderStatusLabels: Record<string, string> = {
  PENDING: "In behandeling",
  PAID: "Betaald",
  PROCESSING: "In verwerking",
  SHIPPED: "Verzonden",
  COMPLETED: "Afgerond",
  CANCELLED: "Geannuleerd",
};

const orderStatusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(
    price
  );

const formatDate = (date: string, withTime = false) =>
  new Date(date).toLocaleDateString("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });

export default function AdminCompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    vatNumber: "",
    chamberOfCommerce: "",
    contactName: "",
    phone: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCompany = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/companies/${companyId}`);
      if (response.ok) {
        const data = await response.json();
        setCompany(data.company);
        setStats(data.stats);
      } else {
        setCompany(null);
      }
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const showSuccess = (message: string) => {
    setErrorMessage("");
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const updateCompany = async (data: Record<string, unknown>) => {
    const response = await fetch(`/api/admin/companies/${companyId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || "Opslaan mislukt");
    }
  };

  const updateStatus = async (status: string) => {
    try {
      await updateCompany({ status });
      showSuccess(
        status === "APPROVED"
          ? "Bedrijf is goedgekeurd!"
          : status === "REJECTED"
          ? "Bedrijf is afgewezen."
          : "Bedrijf staat weer in behandeling."
      );
      fetchCompany();
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const startEditing = () => {
    if (!company) return;
    setForm({
      name: company.name,
      vatNumber: company.vatNumber,
      chamberOfCommerce: company.chamberOfCommerce || "",
      contactName: company.contactName,
      phone: company.phone || "",
    });
    setErrorMessage("");
    setEditing(true);
  };

  const saveEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCompany(form);
      setEditing(false);
      showSuccess("Bedrijfsgegevens opgeslagen.");
      fetchCompany();
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const backButton = (
    <ButtonSecondary
      onClick={() => router.push("/admin/companies")}
      className="mb-4"
    >
      <ArrowLeft className="w-4 h-4 mr-2 inline" />
      Terug naar bedrijven
    </ButtonSecondary>
  );

  if (loading) {
    return (
      <div>
        {backButton}
        <Card>
          <p className="text-center text-gray-600 py-8">Laden...</p>
        </Card>
      </div>
    );
  }

  if (!company || !stats) {
    return (
      <div>
        {backButton}
        <Card>
          <p className="text-center text-red-600 py-8">Bedrijf niet gevonden</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        {backButton}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold text-primary">{company.name}</h1>
              <Badge
                className={
                  companyStatusColors[company.status] ||
                  "bg-gray-100 text-gray-800"
                }
              >
                {companyStatusLabels[company.status] || company.status}
              </Badge>
            </div>
            <p className="text-gray-600">
              Klant sinds {formatDate(company.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {company.status !== "APPROVED" && (
              <ButtonPrimary
                variant="dark"
                className="!px-4 !py-2 text-sm"
                onClick={() => updateStatus("APPROVED")}
              >
                Goedkeuren
              </ButtonPrimary>
            )}
            {company.status !== "REJECTED" && (
              <ButtonPrimary
                variant="yellow"
                className="!px-4 !py-2 text-sm"
                onClick={() => updateStatus("REJECTED")}
              >
                Afwijzen
              </ButtonPrimary>
            )}
            {company.status !== "PENDING" && (
              <ButtonSecondary
                className="!px-4 !py-2 text-sm"
                onClick={() => updateStatus("PENDING")}
              >
                Terug naar in behandeling
              </ButtonSecondary>
            )}
          </div>
        </div>
      </div>

      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="error" className="mb-4">
          {errorMessage}
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bestellingen</p>
              <p className="text-2xl font-bold text-primary">
                {stats.orderCount}
              </p>
            </div>
            <Package className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Totaal besteed (incl. BTW)</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(stats.totalSpentExVat * 1.21)}
              </p>
            </div>
            <Euro className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Gebruikers</p>
              <p className="text-2xl font-bold text-primary">
                {company.users.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Eigen prijzen</p>
              <p className="text-2xl font-bold text-primary">
                {stats.customPriceCount}
              </p>
            </div>
            <Tag className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Company details */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary">Bedrijfsgegevens</h2>
            {!editing && (
              <button
                onClick={startEditing}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                <Pencil className="w-4 h-4" />
                Bewerken
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={saveEdits} className="space-y-4">
              <FormInput
                label="Bedrijfsnaam"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <FormInput
                label="BTW-nummer"
                value={form.vatNumber}
                onChange={(e) => setForm({ ...form, vatNumber: e.target.value })}
                required
              />
              <FormInput
                label="KvK-nummer"
                value={form.chamberOfCommerce}
                onChange={(e) =>
                  setForm({ ...form, chamberOfCommerce: e.target.value })
                }
              />
              <FormInput
                label="Contactpersoon"
                value={form.contactName}
                onChange={(e) =>
                  setForm({ ...form, contactName: e.target.value })
                }
                required
              />
              <FormInput
                label="Telefoon"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <div className="flex gap-2">
                <ButtonPrimary
                  type="submit"
                  variant="dark"
                  className="!px-4 !py-2 text-sm"
                  disabled={saving}
                >
                  {saving ? "Opslaan..." : "Opslaan"}
                </ButtonPrimary>
                <ButtonSecondary
                  type="button"
                  className="!px-4 !py-2 text-sm"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Annuleren
                </ButtonSecondary>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 text-sm">
              <dt className="text-gray-600">Bedrijfsnaam</dt>
              <dd className="sm:col-span-2 font-semibold">{company.name}</dd>
              <dt className="text-gray-600">BTW-nummer</dt>
              <dd className="sm:col-span-2">{company.vatNumber}</dd>
              <dt className="text-gray-600">KvK-nummer</dt>
              <dd className="sm:col-span-2">
                {company.chamberOfCommerce || "—"}
              </dd>
              <dt className="text-gray-600">Contactpersoon</dt>
              <dd className="sm:col-span-2">{company.contactName}</dd>
              <dt className="text-gray-600">Telefoon</dt>
              <dd className="sm:col-span-2">
                {company.phone ? (
                  <a
                    href={`tel:${company.phone}`}
                    className="text-primary hover:underline"
                  >
                    {company.phone}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
              <dt className="text-gray-600">Geregistreerd</dt>
              <dd className="sm:col-span-2">
                {formatDate(company.createdAt, true)}
              </dd>
              <dt className="text-gray-600">Laatste bestelling</dt>
              <dd className="sm:col-span-2">
                {stats.lastOrderAt ? formatDate(stats.lastOrderAt, true) : "—"}
              </dd>
            </dl>
          )}
        </Card>

        {/* Users */}
        <Card>
          <h2 className="text-xl font-bold text-primary mb-4">Gebruikers</h2>
          {company.users.length === 0 ? (
            <p className="text-gray-600 text-sm">
              Er zijn geen gebruikers aan dit bedrijf gekoppeld.
            </p>
          ) : (
            <ul className="divide-y">
              {company.users.map((user) => (
                <li
                  key={user.id}
                  className="py-3 flex flex-wrap justify-between gap-2 text-sm"
                >
                  <a
                    href={`mailto:${user.email}`}
                    className="font-semibold text-primary hover:underline break-all"
                  >
                    {user.email}
                  </a>
                  <span className="text-gray-600">
                    {user.role === "ADMIN" ? "Beheerder · " : ""}
                    sinds {formatDate(user.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-primary">Recente bestellingen</h2>
          {stats.orderCount > 0 && (
            <Link
              href={`/admin/orders/company/${company.id}`}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Alle {stats.orderCount} bestellingen bekijken →
            </Link>
          )}
        </div>
        {company.orders.length === 0 ? (
          <p className="text-gray-600 text-sm">
            Dit bedrijf heeft nog geen bestellingen geplaatst.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Bestelling</th>
                  <th className="text-left p-3">Datum</th>
                  <th className="text-left p-3">Producten</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Totaal (incl. BTW)</th>
                </tr>
              </thead>
              <tbody>
                {company.orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-3 font-semibold text-primary">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="p-3">{formatDate(order.createdAt, true)}</td>
                    <td className="p-3">{order._count.items}</td>
                    <td className="p-3">
                      <Badge
                        className={
                          orderStatusColors[order.status] ||
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {orderStatusLabels[order.status] || order.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {formatPrice(order.total * 1.21)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
