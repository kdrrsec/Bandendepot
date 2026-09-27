"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import FormInput from "@/components/ui/FormInput";
import Alert from "@/components/ui/Alert";

interface Brand {
  id: string;
  name: string;
  slug: string;
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/brands");
      const data = await response.json();
      setBrands(data.brands || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Fout bij aanmaken merk");
        return;
      }

      setFormData({ name: "" });
      setShowForm(false);
      fetchBrands();
    } catch (error) {
      setError("Er is een fout opgetreden");
    }
  };

  const handleDelete = async (brandId: string) => {
    if (!confirm("Weet u zeker dat u dit merk wilt verwijderen?")) return;

    try {
      const response = await fetch(`/api/admin/brands/${brandId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBrands();
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Laden...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Merken</h1>
          <p className="text-gray-600">Beheer merken</p>
        </div>
        <ButtonPrimary onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuleren" : "Nieuw Merk"}
        </ButtonPrimary>
      </div>

      {showForm && (
        <Card className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-primary">
            Nieuw Merk Toevoegen
          </h2>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Merknaam"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              required
            />
            <ButtonPrimary type="submit">Toevoegen</ButtonPrimary>
          </form>
        </Card>
      )}

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <span className="font-semibold">{brand.name}</span>
              <button
                onClick={() => handleDelete(brand.id)}
                className="text-red-600 hover:text-red-800"
              >
                Verwijderen
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}











