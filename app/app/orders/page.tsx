"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Order {
  id: string;
  status: string;
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        const errorMsg = data.error || data.message || "Onbekende fout";
        setError(errorMsg);
        console.error("Error fetching orders:", errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || "Fout bij ophalen van bestellingen";
      setError(errorMsg);
      console.error("Error fetching orders:", error);
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

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Bestellingen</h1>
          <p className="text-gray-600">Overzicht van uw bestellingen</p>
        </div>
        <Card>
          <p className="text-center text-gray-600 py-8">Laden...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Bestellingen</h1>
          <p className="text-gray-600">Overzicht van uw bestellingen</p>
        </div>
        <Card>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Fout: {error}</p>
            <button
              onClick={fetchOrders}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Opnieuw proberen
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Bestellingen</h1>
          <p className="text-gray-600">Overzicht van uw bestellingen</p>
        </div>
        <Card>
          <p className="text-center text-gray-600 py-8">
            U heeft nog geen bestellingen geplaatst.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Bestellingen</h1>
        <p className="text-gray-600">Overzicht van uw bestellingen</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Link key={order.id} href={`/app/orders/${order.id}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Bestelling #{order.id.slice(0, 8)}</h3>
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
              <div className="text-right">
                <Badge className={getStatusColor(order.status)}>
                  {getStatusLabel(order.status)}
                </Badge>
                <p className="text-xl font-bold text-primary mt-2">
                  {formatPrice(order.total * 1.21)}
                </p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Producten ({order.items.length}):</h4>
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
    </div>
  );
}







