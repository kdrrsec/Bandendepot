"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Laden...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Betaling Succesvol!
        </h1>
        <p className="text-gray-600">
          Je bestelling is ontvangen en wordt verwerkt
        </p>
      </div>

      {order && (
        <Card className="max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-primary">
                Bestelnummer: {order.id}
              </h2>
              <p className="text-gray-600 mb-4">
                Je hebt een bevestigingsmail ontvangen op je e-mailadres.
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Bestelling Details:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold">
                    {order.status === "PROCESSING" ? "In Verwerking" : order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Betalingsmethode:</span>
                  <span className="font-semibold capitalize">
                    {order.paymentMethod || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Totaal:</span>
                  <span className="font-bold text-primary">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Bestelde Producten:</h3>
              <div className="space-y-2">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product?.brand?.name} {item.product?.width}/
                      {item.product?.height} R{item.product?.diameter} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <ButtonPrimary
                variant="yellow"
                className="flex-1"
                onClick={() => router.push("/app/orders")}
              >
                Mijn Bestellingen
              </ButtonPrimary>
              <ButtonPrimary
                variant="dark"
                className="flex-1"
                onClick={() => router.push("/app/catalog")}
              >
                Verder Winkelen
              </ButtonPrimary>
            </div>
          </div>
        </Card>
      )}

      {!order && (
        <Card className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 mb-4">
            Bestelling niet gevonden of er is een fout opgetreden.
          </p>
          <ButtonPrimary onClick={() => router.push("/app")}>
            Terug naar Dashboard
          </ButtonPrimary>
        </Card>
      )}
    </div>
  );
}





