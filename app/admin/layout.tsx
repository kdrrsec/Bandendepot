"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ButtonSecondary from "@/components/ui/ButtonSecondary";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/app");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Laden...</div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/companies", label: "Bedrijven" },
    { href: "/admin/brands", label: "Merken" },
    { href: "/admin/products", label: "Producten" },
    { href: "/admin/orders", label: "Bestellingen" },
  ];

  return (
    <div className="min-h-screen bg-neutral-light">
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="text-2xl font-bold">
              Admin Panel
            </Link>
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-white text-primary"
                      : "text-white hover:bg-white hover:bg-opacity-10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/app" className="text-white hover:underline">
                App
              </Link>
              <ButtonSecondary
                onClick={() => signOut()}
                className="!border-white !text-white hover:!bg-white hover:!text-primary"
              >
                Uitloggen
              </ButtonSecondary>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}











