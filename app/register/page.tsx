"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PublicLayout from "@/components/layouts/PublicLayout";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import FormInput from "@/components/ui/FormInput";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function RegisterPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/app");
    }
  }, [session, router]);
  const [formData, setFormData] = useState({
    companyName: "",
    vatNumber: "",
    chamberOfCommerce: "",
    contactName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Er is een fout opgetreden");
        setLoading(false);
        return;
      }

      // Show success message and redirect
      router.push("/login?registered=true");
    } catch (err) {
      setError("Er is een fout opgetreden. Probeer het opnieuw.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PublicLayout>
      <div className="bg-neutral-light py-16 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <h1 className="text-3xl font-bold mb-6 text-primary">
              Account Aanmaken
            </h1>
            {error && (
              <Alert variant="error" className="mb-6">
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Bedrijfsnaam *"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
              <FormInput
                label="BTW-nummer *"
                name="vatNumber"
                value={formData.vatNumber}
                onChange={handleChange}
                required
              />
              <FormInput
                label="KvK-nummer"
                name="chamberOfCommerce"
                value={formData.chamberOfCommerce}
                onChange={handleChange}
              />
              <FormInput
                label="Contactpersoon *"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Wachtwoord *"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <FormInput
                label="Telefoon"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <ButtonPrimary
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Account aanmaken..." : "Account Aanmaken"}
              </ButtonPrimary>
            </form>
            <div className="mt-6 text-center">
              <Link href="/login" className="text-primary hover:underline">
                Al een account? Inloggen
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

