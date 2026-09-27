"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import FormInput from "@/components/ui/FormInput";
import Select from "@/components/ui/Select";
import Link from "next/link";

interface Product {
  id: string;
  brand: { name: string };
  width: number;
  height: number;
  diameter: number;
  season: string;
  sku: string;
}

type ImportMode = "single" | "bulk";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [importMode, setImportMode] = useState<ImportMode>("single");
  const [showForm, setShowForm] = useState(false);
  const [bulkImportType, setBulkImportType] = useState<"csv" | "json" | "xml" | "textarea">("textarea");
  const [bulkData, setBulkData] = useState("");
  const [bulkResult, setBulkResult] = useState<any>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [formData, setFormData] = useState({
    brandId: "",
    width: "",
    height: "",
    diameter: "",
    season: "SUMMER",
    loadIndex: "",
    speedIndex: "",
    sku: "",
    description: "",
  });

  useEffect(() => {
    fetchProducts();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/admin/brands");
      const data = await response.json();
      setBrands(data.brands || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          width: parseInt(formData.width),
          height: parseInt(formData.height),
          diameter: parseInt(formData.diameter),
          loadIndex: parseInt(formData.loadIndex),
        }),
      });

      if (response.ok) {
        setFormData({
          brandId: "",
          width: "",
          height: "",
          diameter: "",
          season: "SUMMER",
          loadIndex: "",
          speedIndex: "",
          sku: "",
          description: "",
        });
        setShowForm(false);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const products: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      if (values.length !== headers.length) continue;

      const product: any = {};
      headers.forEach((header, index) => {
        product[header] = values[index];
      });

      // Map CSV columns to product fields
      const brandName = product.brand || product.merk;
      const brand = brands.find((b) => b.name.toLowerCase() === brandName?.toLowerCase());
      
      if (!brand) {
        continue; // Skip if brand not found
      }

      products.push({
        brandId: brand.id,
        sku: product.sku || "",
        width: product.width || product.breedte || "",
        height: product.height || product.hoogte || "",
        diameter: product.diameter || "",
        season: (product.season || product.seizoen || "SUMMER").toUpperCase(),
        loadIndex: product.loadindex || product.load || "",
        speedIndex: product.speedindex || product.speed || "",
        description: product.description || product.beschrijving || "",
        stockQty: product.stockqty || product.voorraad || 0,
        deliveryDays: product.deliverydays || product.levertijd || 7,
        priceExVat: product.price || product.prijs || 0,
      });
    }

    return products;
  };

  const parseJSON = (jsonText: string): any[] => {
    try {
      const data = JSON.parse(jsonText);
      if (Array.isArray(data)) {
        return data.map((product) => {
          const brandName = product.brand || product.merk;
          const brand = brands.find((b) => b.name.toLowerCase() === brandName?.toLowerCase());
          if (!brand) return null;

          return {
            brandId: brand.id,
            sku: product.sku || "",
            width: product.width || product.breedte || "",
            height: product.height || product.hoogte || "",
            diameter: product.diameter || "",
            season: (product.season || product.seizoen || "SUMMER").toUpperCase(),
            loadIndex: product.loadIndex || product.loadindex || "",
            speedIndex: product.speedIndex || product.speedindex || "",
            description: product.description || product.beschrijving || "",
            stockQty: product.stockQty || product.stockqty || 0,
            deliveryDays: product.deliveryDays || product.deliverydays || 7,
            priceExVat: product.priceExVat || product.price || 0,
          };
        }).filter(Boolean);
      }
      return [];
    } catch (error) {
      throw new Error("Ongeldige JSON format");
    }
  };

  const parseXML = (xmlText: string): any[] => {
    try {
      // Simple XML parser using DOMParser (browser API)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      // Check for parsing errors
      const parseError = xmlDoc.querySelector("parsererror");
      if (parseError) {
        throw new Error("Ongeldige XML format: " + parseError.textContent);
      }

      // Support multiple XML structures:
      // 1. <products><product>...</product></products>
      // 2. <product>...</product> (multiple root elements)
      // 3. <items><item>...</item></items>
      
      let productNodes: NodeListOf<Element>;
      const productsRoot = xmlDoc.querySelector("products");
      const itemsRoot = xmlDoc.querySelector("items");
      
      if (productsRoot) {
        productNodes = productsRoot.querySelectorAll("product");
      } else if (itemsRoot) {
        productNodes = itemsRoot.querySelectorAll("item");
      } else {
        // Try to find all product/item elements at root level
        productNodes = xmlDoc.querySelectorAll("product, item");
      }

      if (productNodes.length === 0) {
        throw new Error("Geen product elementen gevonden in XML");
      }

      const products: any[] = [];

      for (let i = 0; i < productNodes.length; i++) {
        const productNode = productNodes[i];
        
        // Extract values from XML (case-insensitive)
        const getText = (tagName: string): string => {
          const element = productNode.querySelector(tagName);
          if (!element) {
            // Try case-insensitive search
            const allElements = productNode.getElementsByTagName("*");
            for (let j = 0; j < allElements.length; j++) {
              if (allElements[j].tagName.toLowerCase() === tagName.toLowerCase()) {
                return allElements[j].textContent || "";
              }
            }
            return "";
          }
          return element.textContent || "";
        };

        const brandName = getText("brand") || getText("merk");
        const brand = brands.find((b) => b.name.toLowerCase() === brandName?.toLowerCase());
        
        if (!brand) {
          continue; // Skip if brand not found
        }

        products.push({
          brandId: brand.id,
          sku: getText("sku") || "",
          width: getText("width") || getText("breedte") || "",
          height: getText("height") || getText("hoogte") || "",
          diameter: getText("diameter") || "",
          season: (getText("season") || getText("seizoen") || "SUMMER").toUpperCase(),
          loadIndex: getText("loadIndex") || getText("load") || "",
          speedIndex: getText("speedIndex") || getText("speed") || "",
          description: getText("description") || getText("beschrijving") || "",
          stockQty: getText("stockQty") || getText("voorraad") || 0,
          deliveryDays: getText("deliveryDays") || getText("levertijd") || 7,
          priceExVat: getText("priceExVat") || getText("prijs") || 0,
        });
      }

      return products;
    } catch (error: any) {
      throw new Error(error.message || "Ongeldige XML format");
    }
  };

  const handleBulkImport = async () => {
    setBulkLoading(true);
    setBulkResult(null);

    try {
      let productsToImport: any[] = [];

      if (bulkImportType === "csv") {
        productsToImport = parseCSV(bulkData);
      } else if (bulkImportType === "json") {
        productsToImport = parseJSON(bulkData);
      } else if (bulkImportType === "xml") {
        productsToImport = parseXML(bulkData);
      } else {
        // Textarea - expect JSON array format
        productsToImport = parseJSON(bulkData);
      }

      if (productsToImport.length === 0) {
        setBulkResult({
          success: 0,
          errors: 0,
          total: 0,
          details: { success: [], errors: [{ index: 0, sku: "N/A", error: "Geen producten gevonden" }] },
        });
        setBulkLoading(false);
        return;
      }

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: productsToImport }),
      });

      const result = await response.json();
      setBulkResult(result);
      
      if (result.success > 0) {
        fetchProducts();
        setBulkData(""); // Clear on success
      }
    } catch (error: any) {
      setBulkResult({
        success: 0,
        errors: 1,
        total: 0,
        details: {
          success: [],
          errors: [{ index: 0, sku: "N/A", error: error.message || "Fout bij importeren" }],
        },
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setBulkData(content);
      
      // Auto-detect file type
      if (file.name.endsWith(".csv")) {
        setBulkImportType("csv");
      } else if (file.name.endsWith(".json")) {
        setBulkImportType("json");
      } else if (file.name.endsWith(".xml")) {
        setBulkImportType("xml");
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return <div className="text-center py-12">Laden...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Producten</h1>
          <p className="text-gray-600">Beheer producten</p>
        </div>
        <div className="flex gap-2">
          <ButtonSecondary
            onClick={() => {
              setImportMode("single");
              setShowForm(true);
            }}
            className={importMode === "single" ? "bg-primary text-white" : ""}
          >
            Enkel Product
          </ButtonSecondary>
          <ButtonSecondary
            onClick={() => {
              setImportMode("bulk");
              setShowForm(true);
            }}
            className={importMode === "bulk" ? "bg-primary text-white" : ""}
          >
            Bulk Import
          </ButtonSecondary>
        </div>
      </div>

      {showForm && importMode === "single" && (
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">
              Nieuw Product Toevoegen
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Merk"
                value={formData.brandId}
                onChange={(e) =>
                  setFormData({ ...formData, brandId: e.target.value })
                }
                options={[
                  { value: "", label: "Selecteer merk" },
                  ...brands.map((b) => ({
                    value: b.id,
                    label: b.name,
                  })),
                ]}
                required
              />
              <FormInput
                label="SKU"
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
                required
              />
              <FormInput
                label="Breedte"
                type="number"
                value={formData.width}
                onChange={(e) =>
                  setFormData({ ...formData, width: e.target.value })
                }
                required
              />
              <FormInput
                label="Hoogte"
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
                }
                required
              />
              <FormInput
                label="Diameter"
                type="number"
                value={formData.diameter}
                onChange={(e) =>
                  setFormData({ ...formData, diameter: e.target.value })
                }
                required
              />
              <Select
                label="Seizoen"
                value={formData.season}
                onChange={(e) =>
                  setFormData({ ...formData, season: e.target.value })
                }
                options={[
                  { value: "SUMMER", label: "Zomer" },
                  { value: "WINTER", label: "Winter" },
                  { value: "ALL_SEASON", label: "All-Season" },
                ]}
                required
              />
              <FormInput
                label="Load Index"
                type="number"
                value={formData.loadIndex}
                onChange={(e) =>
                  setFormData({ ...formData, loadIndex: e.target.value })
                }
                required
              />
              <FormInput
                label="Speed Index"
                value={formData.speedIndex}
                onChange={(e) =>
                  setFormData({ ...formData, speedIndex: e.target.value })
                }
                required
              />
            </div>
            <FormInput
              label="Beschrijving"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <ButtonPrimary type="submit">Product Toevoegen</ButtonPrimary>
          </form>
        </Card>
      )}

      {showForm && importMode === "bulk" && (
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-primary">
              Bulk Producten Importeren
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setBulkData("");
                setBulkResult(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Import Type Selection */}
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setBulkImportType("textarea")}
                className={`px-4 py-2 rounded ${
                  bulkImportType === "textarea"
                    ? "bg-primary text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                JSON Textarea
              </button>
              <button
                type="button"
                onClick={() => setBulkImportType("csv")}
                className={`px-4 py-2 rounded ${
                  bulkImportType === "csv"
                    ? "bg-primary text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                CSV
              </button>
              <button
                type="button"
                onClick={() => setBulkImportType("json")}
                className={`px-4 py-2 rounded ${
                  bulkImportType === "json"
                    ? "bg-primary text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                JSON Bestand
              </button>
              <button
                type="button"
                onClick={() => setBulkImportType("xml")}
                className={`px-4 py-2 rounded ${
                  bulkImportType === "xml"
                    ? "bg-primary text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                XML
              </button>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Upload Bestand (CSV, JSON of XML)
              </label>
              <input
                type="file"
                accept=".csv,.json,.xml"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
              />
            </div>

            {/* Data Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {bulkImportType === "csv"
                  ? "CSV Data (eerste regel = headers)"
                  : bulkImportType === "xml"
                  ? "XML Data (products/product structuur)"
                  : "JSON Data (array van producten)"}
              </label>
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                placeholder={
                  bulkImportType === "csv"
                    ? `brand,sku,width,height,diameter,season,loadIndex,speedIndex,description,stockQty,deliveryDays,priceExVat
Michelin,MIC-205-55-16-S,205,55,16,SUMMER,91,V,Summer tire,50,7,89.99`
                    : bulkImportType === "xml"
                    ? `<products>
  <product>
    <brand>Michelin</brand>
    <sku>MIC-205-55-16-S</sku>
    <width>205</width>
    <height>55</height>
    <diameter>16</diameter>
    <season>SUMMER</season>
    <loadIndex>91</loadIndex>
    <speedIndex>V</speedIndex>
    <description>Summer tire</description>
    <stockQty>50</stockQty>
    <deliveryDays>7</deliveryDays>
    <priceExVat>89.99</priceExVat>
  </product>
</products>`
                    : `[
  {
    "brand": "Michelin",
    "sku": "MIC-205-55-16-S",
    "width": 205,
    "height": 55,
    "diameter": 16,
    "season": "SUMMER",
    "loadIndex": 91,
    "speedIndex": "V",
    "description": "Summer tire",
    "stockQty": 50,
    "deliveryDays": 7,
    "priceExVat": 89.99
  }
]`
                }
                className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm"
                rows={10}
              />
            </div>

            {/* Format Help */}
            <div className="bg-gray-50 p-4 rounded text-sm">
              <p className="font-semibold mb-2">Verplichte velden:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>brand/merk (moet bestaan in systeem)</li>
                <li>sku (uniek)</li>
                <li>width/breedte, height/hoogte, diameter</li>
                <li>season/seizoen (SUMMER, WINTER, ALL_SEASON)</li>
                <li>loadIndex/load, speedIndex/speed</li>
              </ul>
              <p className="font-semibold mt-3 mb-1">Optionele velden:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>description/beschrijving</li>
                <li>stockQty/voorraad (default: 0)</li>
                <li>deliveryDays/levertijd (default: 7)</li>
                <li>priceExVat/prijs (default: 0)</li>
              </ul>
            </div>

            {/* Submit Button */}
            <ButtonPrimary
              onClick={handleBulkImport}
              disabled={bulkLoading || !bulkData.trim()}
            >
              {bulkLoading ? "Importeren..." : "Producten Importeren"}
            </ButtonPrimary>

            {/* Results */}
            {bulkResult && (
              <div
                className={`mt-4 p-4 rounded ${
                  bulkResult.success > 0
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <h3 className="font-semibold mb-2">Import Resultaat:</h3>
                <p>
                  Succesvol: <strong>{bulkResult.success}</strong> | Fouten:{" "}
                  <strong>{bulkResult.errors}</strong> | Totaal:{" "}
                  <strong>{bulkResult.total}</strong>
                </p>
                {bulkResult.details?.errors?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-semibold text-red-600">Fouten:</p>
                    <ul className="list-disc list-inside text-sm">
                      {bulkResult.details.errors.map((err: any, idx: number) => (
                        <li key={idx}>
                          Regel {err.index + 1} (SKU: {err.sku}): {err.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Merk</th>
                <th className="text-left p-4">SKU</th>
                <th className="text-left p-4">Maat</th>
                <th className="text-left p-4">Seizoen</th>
                <th className="text-left p-4">Acties</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{product.brand.name}</td>
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">
                    {product.width}/{product.height} R{product.diameter}
                  </td>
                  <td className="p-4">{product.season}</td>
                  <td className="p-4">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-primary hover:underline"
                    >
                      Bewerken
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}











