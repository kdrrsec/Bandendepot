"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import FormInput from "@/components/ui/FormInput";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import Pagination from "@/components/ui/Pagination";
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
  inventory: { stockQty: number; deliveryDays: number } | null;
  prices: { priceExVat: number }[];
}

export default function CatalogPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    width: "",
    height: "",
    diameter: "",
    brand: "",
    season: "",
    loadIndex: "",
    speedIndex: "",
  });

  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ),
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const getPrice = (product: Product) => {
    if (!product.prices || product.prices.length === 0) return null;
    return product.prices[0].priceExVat;
  };

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Product Catalogus</h1>
        <p className="text-gray-600">Zoek en filter banden</p>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
          <FormInput
            label="Breedte"
            type="number"
            value={filters.width}
            onChange={(e) => handleFilterChange("width", e.target.value)}
            placeholder="205"
          />
          <FormInput
            label="Hoogte"
            type="number"
            value={filters.height}
            onChange={(e) => handleFilterChange("height", e.target.value)}
            placeholder="55"
          />
          <FormInput
            label="Diameter"
            type="number"
            value={filters.diameter}
            onChange={(e) => handleFilterChange("diameter", e.target.value)}
            placeholder="16"
          />
          <Select
            label="Merk"
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
            options={[
              { value: "", label: "Alle merken" },
              { value: "michelin", label: "Michelin" },
              { value: "bridgestone", label: "Bridgestone" },
            ]}
          />
          <Select
            label="Seizoen"
            value={filters.season}
            onChange={(e) => handleFilterChange("season", e.target.value)}
            options={[
              { value: "", label: "Alle seizoenen" },
              { value: "SUMMER", label: "Zomer" },
              { value: "WINTER", label: "Winter" },
              { value: "ALL_SEASON", label: "All-Season" },
            ]}
          />
          <FormInput
            label="Load Index"
            type="number"
            value={filters.loadIndex}
            onChange={(e) => handleFilterChange("loadIndex", e.target.value)}
            placeholder="91"
          />
          <FormInput
            label="Speed Index"
            value={filters.speedIndex}
            onChange={(e) => handleFilterChange("speedIndex", e.target.value)}
            placeholder="V"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <ButtonPrimary
            onClick={() => {
              setFilters({
                width: "",
                height: "",
                diameter: "",
                brand: "",
                season: "",
                loadIndex: "",
                speedIndex: "",
              });
            }}
            variant="dark"
          >
            Filters Wissen
          </ButtonPrimary>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg ${
                viewMode === "table"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Tabel
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12">Laden...</div>
      ) : products.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">
            Geen producten gevonden
          </p>
        </Card>
      ) : viewMode === "table" ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Maat</th>
                  <th className="text-left p-4">Seizoen</th>
                  <th className="text-left p-4">Voorraad</th>
                  <th className="text-left p-4">Levertijd</th>
                  <th className="text-left p-4">Prijs</th>
                  <th className="text-left p-4">Acties</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const price = getPrice(product);
                  return (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.brand.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <ImageIcon className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold">
                              {product.brand.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {product.sku}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {product.width}/{product.height} R{product.diameter}
                      </td>
                      <td className="p-4">
                        <Badge variant="season">
                          {getSeasonLabel(product.season)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="stock"
                          className={
                            product.inventory?.stockQty === 0
                              ? "bg-red-100 text-red-800"
                              : ""
                          }
                        >
                          {product.inventory?.stockQty || 0} stuks
                        </Badge>
                      </td>
                      <td className="p-4">
                        {product.inventory?.deliveryDays || 7} dagen
                      </td>
                      <td className="p-4 font-semibold">
                        {price ? formatPrice(price) : "N/A"}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <ButtonPrimary
                            variant="dark"
                            className="!px-3 !py-1 text-sm"
                            onClick={() =>
                              (window.location.href = `/app/product/${product.id}`)
                            }
                          >
                            Bekijk
                          </ButtonPrimary>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const price = getPrice(product);
            return (
              <Card key={product.id}>
                <div className="mb-4">
                  <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center mb-4">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.brand.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12 mb-1" />
                        <span className="text-xs">Geen afbeelding</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {product.brand.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">{product.sku}</p>
                  <p className="font-medium mb-2">
                    {product.width}/{product.height} R{product.diameter}
                  </p>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="season">
                      {getSeasonLabel(product.season)}
                    </Badge>
                    <Badge
                      variant="stock"
                      className={
                        product.inventory?.stockQty === 0
                          ? "bg-red-100 text-red-800"
                          : ""
                      }
                    >
                      {product.inventory?.stockQty || 0} stuks
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Levertijd: {product.inventory?.deliveryDays || 7} dagen
                  </p>
                  <p className="text-xl font-bold text-primary mb-4">
                    {price ? formatPrice(price) : "N/A"}
                  </p>
                  <ButtonPrimary
                    variant="dark"
                    className="w-full"
                    onClick={() =>
                      (window.location.href = `/app/product/${product.id}`)
                    }
                  >
                    Bekijk Details
                  </ButtonPrimary>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}







