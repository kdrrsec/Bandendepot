"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import PublicLayout from "@/components/layouts/PublicLayout";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import FormInput from "@/components/ui/FormInput";
import Alert from "@/components/ui/Alert";
import FeatureCard from "@/components/ui/FeatureCard";
import BrandStrip from "@/components/ui/BrandStrip";
import { Wallet, TrendingUp, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tireImageError, setTireImageError] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error === "CredentialsSignin" ? "Ongeldige inloggegevens" : result.error);
      } else {
        router.push("/app");
        router.refresh();
      }
    } catch (err) {
      setError("Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center bg-gray-900 text-white py-24 min-h-[600px] flex items-center"
        style={{
          backgroundImage: "url('/images/hero/hero-background.jpg.png')",
          backgroundPosition: "center 90%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-primary bg-opacity-60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                GROOTHANDEL IN BANDEN
              </h1>
              <p className="text-xl mb-4">
                B2B-only platform voor groothandelaren
              </p>
              <p className="text-lg text-gray-300">
                Registreer om toegang te krijgen tot onze prijzen en catalogus
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-8 text-gray-900">
              <h2 className="text-2xl font-bold mb-6 text-primary">Inloggen</h2>
              {error && (
                <Alert variant="error" className="mb-4">
                  {error}
                </Alert>
              )}
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <FormInput
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <FormInput
                    type="password"
                    label="Wachtwoord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <ButtonPrimary
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Inloggen..." : "INLOGGEN"}
                  </ButtonPrimary>
                </div>
              </form>
              <div className="mt-4 text-center">
                <Link
                  href="/register"
                  className="text-primary hover:underline font-medium"
                >
                  MAAK GRATIS ACCOUNT AAN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-primary">
            MEER DAN 300 BESCHIKBARE MERKEN
          </h2>
          <BrandStrip />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            MEER DAN 300 BESCHIKBARE MERKEN
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Groothandel inkoopprijs"
              description="Beste prijzen voor groothandelaren en dealers"
              icon={<Wallet className="w-8 h-8" />}
            />
            <FeatureCard
              title="Informatie over de marktprijzen"
              description="Altijd op de hoogte van de laatste marktprijzen"
              icon={<BarChart3 className="w-8 h-8" />}
            />
            <FeatureCard
              title="Maximum marge winst"
              description="Optimaliseer uw winstmarge met onze prijzen"
              icon={<TrendingUp className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">Wie zijn wij?</h2>
              <p className="text-gray-700 mb-4">
                Bandendepot.com is de toonaangevende B2B groothandel voor banden en
                onderdelen in Nederland. Met meer dan 300 merken en duizenden producten
                bieden wij groothandelaren en dealers de beste prijzen en service.
              </p>
              <p className="text-gray-700 mb-6">
                Ons platform is exclusief voor goedgekeurde B2B-klanten. Registreer
                vandaag nog en ontdek waarom duizenden dealers bij ons kopen.
              </p>
              <Link href="/over-ons">
                <ButtonPrimary variant="yellow" className="inline-block">
                  MEER WETEN
                </ButtonPrimary>
              </Link>
            </div>
            <div className="rounded-lg h-64 overflow-hidden relative">
              {tireImageError ? (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-lg">Tire Image</span>
                </div>
              ) : (
                <img
                  src="/images/tire/tire-image.jpg"
                  alt="Banden en onderdelen"
                  className="w-full h-full object-cover rounded-lg"
                  onError={() => setTireImageError(true)}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            Klaar om te beginnen?
          </h2>
          <p className="text-lg mb-6 text-primary">
            Registreer nu en krijg toegang tot onze volledige catalogus en
            groothandelsprijzen
          </p>
          <Link href="/register">
            <ButtonPrimary variant="dark" className="text-lg px-8 py-4">
              GRATIS ACCOUNT AANMAKEN
            </ButtonPrimary>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
