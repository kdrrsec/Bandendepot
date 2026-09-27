"use client";

import { useCart } from "@/lib/cart-context";
import Card from "@/components/ui/Card";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import { useState, useEffect } from "react";
import Alert from "@/components/ui/Alert";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [companyStatus, setCompanyStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check company status
    if (session?.user?.companyId) {
      fetch("/api/company")
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            setCompanyStatus(data.status);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      setMessage({ type: "error", text: "Je winkelwagen is leeg" });
      return;
    }

    // Check if user has a company
    if (!session?.user?.companyId) {
      setMessage({ 
        type: "error", 
        text: "Je moet een bedrijfsaccount hebben om bestellingen te plaatsen. Admin accounts kunnen geen bestellingen plaatsen." 
      });
      return;
    }

    // Check if company is approved
    if (companyStatus && companyStatus !== "APPROVED") {
      setMessage({ 
        type: "error", 
        text: `Je bedrijf is nog niet goedgekeurd. Status: ${companyStatus === "PENDING" ? "In behandeling" : "Afgewezen"}. Neem contact op met de beheerder.` 
      });
      return;
    }

    // Redirect to checkout page
    router.push("/app/checkout");
  };

  if (items.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Winkelwagen</h1>
          <p className="text-gray-600">Je winkelwagen is leeg</p>
        </div>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Je hebt nog geen producten toegevoegd</p>
            <a href="/app/catalog">
              <ButtonPrimary variant="yellow">Naar Catalogus</ButtonPrimary>
            </a>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Winkelwagen</h1>
          <p className="text-gray-600">{items.length} {items.length === 1 ? "product" : "producten"}</p>
        </div>
        <ButtonSecondary onClick={clearCart}>Winkelwagen legen</ButtonSecondary>
      </div>

      {message && (
        <Alert variant={message.type} className="mb-6">
          {message.text}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between p-4 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    <p className="text-sm text-gray-600">{item.sku}</p>
                    <p className="text-primary font-semibold mt-1">
                      {formatPrice(item.price)} per stuk
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <div className="w-32 text-right">
                      <p className="font-bold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-xl font-semibold mb-4 text-primary">Bestelling Overzicht</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotaal:</span>
                <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">BTW (21%):</span>
                <span className="font-semibold">
                  {formatPrice(getTotalPrice() * 0.21)}
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg">
                <span className="font-bold">Totaal:</span>
                <span className="font-bold text-primary">
                  {formatPrice(getTotalPrice() * 1.21)}
                </span>
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
              {!session?.user?.companyId && (
                <Alert variant="error" className="mb-4">
                  Je moet een bedrijfsaccount hebben om bestellingen te plaatsen.
                </Alert>
              )}
              <ButtonPrimary
                variant="yellow"
                className="w-full mt-6"
                onClick={handleCheckout}
                disabled={companyStatus !== "APPROVED" || !session?.user?.companyId}
              >
                Naar Afrekenen
              </ButtonPrimary>
              <a href="/app/catalog">
                <ButtonSecondary className="w-full mt-2">
                  Verder Winkelen
                </ButtonSecondary>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

