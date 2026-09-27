"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import Select from "@/components/ui/Select";
import { ArrowLeft, Building2, Package } from "lucide-react";

interface Order {
  id: string;
  status: string;
  paymentMethod: string | null;
  paymentStatus: string | null;
  total: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      sku: string;
      brand: { name: string };
      width: number;
      height: number;
      diameter: number;
    };
  }[];
}

interface Company {
  id: string;
  name: string;
  vatNumber: string;
  contactName: string;
  phone: string | null;
  status: string;
}

export default function CompanyOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    if (params.companyId) {
      fetchCompanyOrders(params.companyId as string);
    }
  }, [params.companyId, statusFilter]);

  const fetchCompanyOrders = async (companyId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/company/${companyId}`);
      if (response.ok) {
        const data = await response.json();
        setCompany(data.company);
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching company orders:", error);
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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "In behandeling",
      PAID: "Betaald",
      PROCESSING: "In verwerking",
      SHIPPED: "Verzonden",
      COMPLETED: "Afgerond",
      CANCELLED: "Geannuleerd",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-blue-100 text-blue-800",
      PROCESSING: "bg-purple-100 text-purple-800",
      SHIPPED: "bg-indigo-100 text-indigo-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredOrders = statusFilter === "ALL" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <ButtonSecondary onClick={() => router.push("/admin/orders")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Terug naar overzicht
          </ButtonSecondary>
          <h1 className="text-3xl font-bold text-primary mb-2">Bedrijfsbestellingen</h1>
        </div>
        <Card>
          <p className="text-center text-gray-600 py-8">Laden...</p>
        </Card>
      </div>
    );
  }

  if (!company) {
    return (
      <div>
        <div className="mb-8">
          <ButtonSecondary onClick={() => router.push("/admin/orders")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Terug naar overzicht
          </ButtonSecondary>
          <h1 className="text-3xl font-bold text-primary mb-2">Bedrijfsbestellingen</h1>
        </div>
        <Card>
          <p className="text-center text-red-600 py-8">Bedrijf niet gevonden</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <ButtonSecondary onClick={() => router.push("/admin/orders")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2 inline" />
          Terug naar overzicht
        </ButtonSecondary>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold text-primary">{company.name}</h1>
            </div>
            <p className="text-gray-600">BTW-nummer: {company.vatNumber}</p>
            <p className="text-gray-600">Contactpersoon: {company.contactName}</p>
            {company.phone && <p className="text-gray-600">Telefoon: {company.phone}</p>}
          </div>
          <div className="w-48">
            <Select
              label="Filter op status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "ALL", label: "Alle statussen" },
                { value: "PENDING", label: "In behandeling" },
                { value: "PAID", label: "Betaald" },
                { value: "PROCESSING", label: "In verwerking" },
                { value: "SHIPPED", label: "Verzonden" },
                { value: "COMPLETED", label: "Afgerond" },
                { value: "CANCELLED", label: "Geannuleerd" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Totaal Bestellingen</p>
              <p className="text-2xl font-bold text-primary">{filteredOrders.length}</p>
            </div>
            <Package className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Totaal Omzet</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(totalRevenue * 1.21)}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Gemiddeld per Bestelling</p>
              <p className="text-2xl font-bold text-primary">
                {filteredOrders.length > 0
                  ? formatPrice((totalRevenue / filteredOrders.length) * 1.21)
                  : formatPrice(0)}
              </p>
            </div>
            <Package className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">
            {statusFilter === "ALL"
              ? "Dit bedrijf heeft nog geen bestellingen geplaatst."
              : "Geen bestellingen gevonden met deze status."}
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      Bestelling #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("nl-NL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <p className="text-xl font-bold text-primary mt-2">
                      {formatPrice(order.total * 1.21)}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Producten ({order.items.length}):</h4>
                    {order.paymentMethod && (
                      <Badge className="bg-gray-100 text-gray-800">
                        {order.paymentMethod.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {order.items.slice(0, 3).map((item) => (
                      <li key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.product.brand.name} {item.product.width}/{item.product.height} R
                          {item.product.diameter} ({item.product.sku}) × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                    {order.items.length > 3 && (
                      <li className="text-sm text-primary font-semibold">
                        + {order.items.length - 3} meer producten...
                      </li>
                    )}
                  </ul>
                  <p className="text-sm text-primary mt-3 font-medium">
                    Klik voor volledige details →
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
