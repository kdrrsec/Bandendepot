"use client";

import { useCart } from "@/lib/cart-context";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import FormInput from "@/components/ui/FormInput";
import Alert from "@/components/ui/Alert";
import { paymentMethods } from "@/config/payments";
import PaymentLogo from "@/components/ui/PaymentLogo";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [companyStatus, setCompanyStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/app/cart");
      return;
    }

    if (session?.user?.companyId) {
      fetch("/api/company")
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            setCompanyStatus(data.status);
            setCompanyData(data);
          }
        })
        .catch(console.error);
    }
  }, [session, items, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const vat = subtotal * 0.21;
  const total = subtotal + vat;

  const handlePayment = async () => {
    if (!selectedPayment) {
      setMessage({ type: "error", text: "Selecteer een betalingsmethode" });
      return;
    }

    if (!session?.user?.companyId) {
      setMessage({ 
        type: "error", 
        text: "Je moet een bedrijfsaccount hebben om bestellingen te plaatsen." 
      });
      return;
    }

    if (companyStatus !== "APPROVED") {
      setMessage({ 
        type: "error", 
        text: `Je bedrijf is nog niet goedgekeurd. Status: ${companyStatus === "PENDING" ? "In behandeling" : "Afgewezen"}.` 
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          paymentMethod: selectedPayment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.error || "Betalingsverwerking mislukt" });
        setLoading(false);
        return;
      }

      // Redirect to payment confirmation or external payment provider
      if (data.paymentUrl) {
        // For external payment providers (like iDEAL)
        window.location.href = data.paymentUrl;
      } else {
        // For immediate payment confirmation
        clearCart();
        router.push(`/app/checkout/success?orderId=${data.orderId}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage({ 
        type: "error", 
        text: "Er is een fout opgetreden bij het verwerken van de betaling." 
      });
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Afrekenen</h1>
        <p className="text-gray-600">Voltooi je bestelling en kies een betalingsmethode</p>
      </div>

      {message && (
        <Alert variant={message.type} className="mb-6">
          {message.text}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-primary">Bedrijfsgegevens</h2>
            {companyData ? (
              <div className="space-y-2 text-gray-700">
                <p><strong>Bedrijfsnaam:</strong> {companyData.name}</p>
                <p><strong>BTW-nummer:</strong> {companyData.vatNumber}</p>
                <p><strong>Contactpersoon:</strong> {companyData.contactName}</p>
                {companyData.phone && <p><strong>Telefoon:</strong> {companyData.phone}</p>}
              </div>
            ) : (
              <p className="text-gray-600">Bedrijfsgegevens worden geladen...</p>
            )}
          </Card>

          {/* Payment Methods */}
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-primary">Betalingsmethode</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.slug}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPayment === method.slug
                      ? "border-accent bg-accent bg-opacity-10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.slug}
                    checked={selectedPayment === method.slug}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    className="mr-4 w-5 h-5 text-accent"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <PaymentLogo
                      name={method.name}
                      slug={method.slug}
                      logoSrc={method.logo}
                      className="h-8"
                    />
                    <span className="font-medium text-gray-700">{method.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-primary">Bestelling Overzicht</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.productName} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotaal:</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">BTW (21%):</span>
                  <span className="font-semibold">{formatPrice(vat)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg">
                  <span className="font-bold">Totaal:</span>
                  <span className="font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>
              {companyStatus === "PENDING" && (
                <Alert variant="warning" className="mb-4">
                  Je bedrijf is nog in behandeling. Je kunt nog geen bestellingen plaatsen.
                </Alert>
              )}
              {companyStatus === "REJECTED" && (
                <Alert variant="error" className="mb-4">
                  Je bedrijf is afgewezen. Neem contact op met de beheerder.
                </Alert>
              )}
              <ButtonPrimary
                variant="yellow"
                className="w-full mt-6"
                onClick={handlePayment}
                disabled={loading || companyStatus !== "APPROVED" || !selectedPayment}
              >
                {loading ? "Verwerken..." : "Betalen en Bestellen"}
              </ButtonPrimary>
              <ButtonSecondary
                className="w-full mt-2"
                onClick={() => router.push("/app/cart")}
              >
                Terug naar Winkelwagen
              </ButtonSecondary>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}





