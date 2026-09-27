"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import Select from "@/components/ui/Select";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { ArrowLeft, Package, Calendar, CreditCard, Building2, Truck, Edit } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    sku: string;
    width: number;
    height: number;
    diameter: number;
    season: string;
    loadIndex: number;
    speedIndex: string;
    description: string | null;
    brand: {
      name: string;
    };
  };
}

interface Order {
  id: string;
  status: string;
  paymentMethod: string | null;
  paymentStatus: string | null;
  paymentId: string | null;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  company?: {
    id: string;
    name: string;
    vatNumber: string;
    chamberOfCommerce: string | null;
    contactName: string;
    phone: string | null;
  };
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        setNewStatus(data.status);
      } else {
        setError("Bestelling niet gevonden");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Fout bij ophalen van bestelling");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!order || newStatus === order.status) {
      setEditingStatus(false);
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchOrder(order.id);
        setEditingStatus(false);
      } else {
        alert("Fout bij bijwerken van status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Fout bij bijwerken van status");
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const getPaymentStatusLabel = (status: string | null) => {
    if (!status) return "Niet beschikbaar";
    const labels: Record<string, string> = {
      PENDING: "In behandeling",
      PAID: "Betaald",
      FAILED: "Mislukt",
      CANCELLED: "Geannuleerd",
    };
    return labels[status] || status;
  };

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return "Niet opgegeven";
    const labels: Record<string, string> = {
      ideal: "iDEAL",
      klarna: "Klarna",
      amex: "American Express",
      maestro: "Maestro",
    };
    return labels[method.toLowerCase()] || method.toUpperCase();
  };

  const getSeasonLabel = (season: string) => {
    const labels: Record<string, string> = {
      SUMMER: "Zomer",
      WINTER: "Winter",
      ALL_SEASON: "All-Season",
    };
    return labels[season] || season;
  };

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <ButtonSecondary onClick={() => router.push("/admin/orders")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Terug naar bestellingen
          </ButtonSecondary>
          <h1 className="text-3xl font-bold text-primary mb-2">Bestelling Details</h1>
        </div>
        <Card>
          <p className="text-center text-gray-600 py-8">Laden...</p>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <div className="mb-8">
          <ButtonSecondary onClick={() => router.push("/admin/orders")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Terug naar bestellingen
          </ButtonSecondary>
          <h1 className="text-3xl font-bold text-primary mb-2">Bestelling Details</h1>
        </div>
        <Card>
          <p className="text-center text-red-600 py-8">{error || "Bestelling niet gevonden"}</p>
        </Card>
      </div>
    );
  }

  const subtotal = order.total;
  const vat = subtotal * 0.21;
  const total = subtotal + vat;

  return (
    <div>
      <div className="mb-8">
        <ButtonSecondary onClick={() => router.push("/admin/orders")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2 inline" />
          Terug naar bestellingen
        </ButtonSecondary>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">
              Bestelling #{order.id.slice(0, 8)}
            </h1>
            <p className="text-gray-600">Gedetailleerd overzicht van de bestelling</p>
          </div>
          <div className="flex items-center gap-3">
            {editingStatus ? (
              <div className="flex items-center gap-2">
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  options={[
                    { value: "PENDING", label: "In behandeling" },
                    { value: "PAID", label: "Betaald" },
                    { value: "PROCESSING", label: "In verwerking" },
                    { value: "SHIPPED", label: "Verzonden" },
                    { value: "COMPLETED", label: "Afgerond" },
                    { value: "CANCELLED", label: "Geannuleerd" },
                  ]}
                />
                <ButtonPrimary onClick={handleStatusUpdate} disabled={saving}>
                  {saving ? "Opslaan..." : "Opslaan"}
                </ButtonPrimary>
                <ButtonSecondary onClick={() => {
                  setEditingStatus(false);
                  setNewStatus(order.status);
                }}>
                  Annuleren
                </ButtonSecondary>
              </div>
            ) : (
              <>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
                <ButtonSecondary
                  onClick={() => setEditingStatus(true)}
                  className="!border-primary !text-primary hover:!bg-primary hover:!text-white"
                >
                  <Edit className="w-4 h-4 mr-2 inline" />
                  Status wijzigen
                </ButtonSecondary>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-primary">Bestelde Producten</h2>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {item.product.brand.name} {item.product.width}/{item.product.height} R
                        {item.product.diameter}
                      </h3>
                      <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                      {item.product.description && (
                        <p className="text-sm text-gray-500 mt-1">{item.product.description}</p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-primary text-lg">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="bg-gray-100 text-gray-800">
                      {getSeasonLabel(item.product.season)}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      Load Index: {item.product.loadIndex}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      Speed Index: {item.product.speedIndex}
                    </Badge>
                    <Badge className="bg-gray-100 text-gray-800">
                      Aantal: {item.quantity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Order Summary */}
          <Card>
            <h2 className="text-xl font-semibold text-primary mb-4">Bestellingsoverzicht</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotaal (excl. BTW):</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>BTW (21%):</span>
                <span className="font-semibold">{formatPrice(vat)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg">
                <span className="font-bold text-primary">Totaal (incl. BTW):</span>
                <span className="font-bold text-primary text-xl">{formatPrice(total)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Information */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-primary">Bestelinformatie</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Bestelnummer</p>
                <p className="font-semibold">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Besteldatum</p>
                <p className="font-semibold">{formatDate(order.createdAt)}</p>
              </div>
              {order.updatedAt !== order.createdAt && (
                <div>
                  <p className="text-sm text-gray-600">Laatst bijgewerkt</p>
                  <p className="font-semibold">{formatDate(order.updatedAt)}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Payment Information */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-primary">Betalingsinformatie</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Betalingsmethode</p>
                <p className="font-semibold">{getPaymentMethodLabel(order.paymentMethod)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Betalingsstatus</p>
                <Badge
                  className={
                    order.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-800"
                      : order.paymentStatus === "FAILED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {getPaymentStatusLabel(order.paymentStatus)}
                </Badge>
              </div>
              {order.paymentId && (
                <div>
                  <p className="text-sm text-gray-600">Betalings-ID</p>
                  <p className="font-semibold text-xs break-all">{order.paymentId}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Company Information */}
          {order.company && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-primary">Bedrijfsgegevens</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Bedrijfsnaam</p>
                  <p className="font-semibold">{order.company.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">BTW-nummer</p>
                  <p className="font-semibold">{order.company.vatNumber}</p>
                </div>
                {order.company.chamberOfCommerce && (
                  <div>
                    <p className="text-sm text-gray-600">KVK-nummer</p>
                    <p className="font-semibold">{order.company.chamberOfCommerce}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Contactpersoon</p>
                  <p className="font-semibold">{order.company.contactName}</p>
                </div>
                {order.company.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Telefoon</p>
                    <p className="font-semibold">{order.company.phone}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Shipping Status */}
          {order.status === "SHIPPED" && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-primary">Verzending</h2>
              </div>
              <p className="text-gray-600">
                Deze bestelling is verzonden.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
