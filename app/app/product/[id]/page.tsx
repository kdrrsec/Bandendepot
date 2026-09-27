"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import Alert from "@/components/ui/Alert";
import { useCart } from "@/lib/cart-context";
import { Image as ImageIcon } from "lucide-react";

interface Product {
  id: string;
  brand: { name: string };
  width: number;
  height: number;
  diameter: number;
  season: string;
  loadIndex: number;
  speedIndex: string;
  sku: string;
  imageUrl: string | null;
  description: string | null;
  inventory: { stockQty: number; deliveryDays: number } | null;
  prices: { priceExVat: number }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Laden...</div>;
  }

  if (!product) {
    return (
      <Alert variant="error">Product niet gevonden</Alert>
    );
  }

  const price = product.prices?.[0]?.priceExVat;
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const getSeasonLabel = (season: string) => {
    const labels: Record<string, string> = {
      SUMMER: "Zomer",
      WINTER: "Winter",
      ALL_SEASON: "All-Season",
    };
    return labels[season] || season;
  };

  return (
    <div>
      <div className="mb-6">
        <a
          href="/app/catalog"
          className="text-primary hover:underline mb-4 inline-block"
        >
          ← Terug naar catalogus
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.brand.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-16 h-16 mb-2" />
                <span className="text-sm">Geen afbeelding</span>
              </div>
            )}
          </div>
        </Card>

        <div>
          <Card className="mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {product.brand.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.sku}</p>
            <div className="flex gap-2 mb-4">
              <Badge variant="season">{getSeasonLabel(product.season)}</Badge>
              <Badge
                variant="stock"
                className={
                  product.inventory?.stockQty === 0
                    ? "bg-red-100 text-red-800"
                    : ""
                }
              >
                {product.inventory?.stockQty || 0} stuks op voorraad
              </Badge>
            </div>
            <div className="text-3xl font-bold text-primary mb-6">
              {price ? formatPrice(price) : "N/A"}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aantal
                </label>
                <input
                  type="number"
                  min="1"
                  max={product.inventory?.stockQty || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-24 px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <ButtonPrimary
                variant="yellow"
                className="w-full"
                onClick={() => {
                  if (product && price) {
                    addItem({
                      productId: product.id,
                      quantity,
                      price,
                      productName: `${product.brand.name} ${product.width}/${product.height} R${product.diameter}`,
                      sku: product.sku,
                    });
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 3000);
                  }
                }}
              >
                {addedToCart ? "✓ Toegevoegd!" : "Toevoegen aan winkelwagen"}
              </ButtonPrimary>
              {addedToCart && (
                <Alert variant="success" className="mt-2">
                  Product toegevoegd aan winkelwagen!
                </Alert>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4 text-primary">
              Product Specificaties
            </h2>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-600">Maat:</dt>
                <dd className="font-semibold">
                  {product.width}/{product.height} R{product.diameter}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Load Index:</dt>
                <dd className="font-semibold">{product.loadIndex}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Speed Index:</dt>
                <dd className="font-semibold">{product.speedIndex}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Levertijd:</dt>
                <dd className="font-semibold">
                  {product.inventory?.deliveryDays || 7} dagen
                </dd>
              </div>
            </dl>
            {product.description && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold mb-2">Beschrijving</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}







