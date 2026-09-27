"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import PublicLayout from "@/components/layouts/PublicLayout";
import ButtonPrimary from "@/components/ui/ButtonPrimary";
import FormInput from "@/components/ui/FormInput";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { signIn } from "next-auth/react";

function LoginForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registered = searchParams.get("registered");

  useEffect(() => {
    if (session) {
      if (session.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/app");
      }
    }
  }, [session, router]);

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
        setError(
          result.error === "CredentialsSignin"
            ? "Ongeldige inloggegevens"
            : result.error
        );
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
      <div className="bg-neutral-light py-16 min-h-screen">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <h1 className="text-3xl font-bold mb-6 text-primary">Inloggen</h1>
            {registered && (
              <Alert variant="success" className="mb-6">
                Je account wordt gecontroleerd. Je ontvangt bericht na goedkeuring.
              </Alert>
            )}
            {error && (
              <Alert variant="error" className="mb-6">
                {error}
              </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
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
              <ButtonPrimary type="submit" className="w-full" disabled={loading}>
                {loading ? "Inloggen..." : "INLOGGEN"}
              </ButtonPrimary>
            </form>
            <div className="mt-6 text-center">
              <Link href="/register" className="text-primary hover:underline">
                Nog geen account? Registreer hier
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="bg-neutral-light py-16 min-h-screen">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <div className="text-center py-8">Laden...</div>
            </Card>
          </div>
        </div>
      </PublicLayout>
    }>
      <LoginForm />
    </Suspense>
  );
}

