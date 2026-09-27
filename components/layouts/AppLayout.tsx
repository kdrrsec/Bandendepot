"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import ButtonSecondary from "../ui/ButtonSecondary";
import { useCart } from "@/lib/cart-context";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { getTotalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const navLinks = [
    { href: "/app", label: "Dashboard" },
    { href: "/app/catalog", label: "Catalogus" },
    { href: "/app/orders", label: "Bestellingen" },
    { href: "/app/account", label: "Account" },
  ];

  if (session?.user?.role === "ADMIN") {
    navLinks.push({ href: "/admin", label: "Admin" });
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <header className="bg-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/app" className="flex items-center ml-4 md:-ml-8 mt-2">
              {logoError ? (
                <span className="text-2xl font-bold text-white">Bandendepot.com</span>
              ) : (
                <img
                  src="/images/logo/logo.png"
                  alt="Bandendepot.com"
                  className="h-[220px] w-auto object-contain"
                  onError={() => setLogoError(true)}
                />
              )}
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
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
              <Link
                href="/app/cart"
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  pathname === "/app/cart"
                    ? "bg-white text-primary"
                    : "text-white hover:bg-white hover:bg-opacity-10"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Winkelwagen
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
              <ButtonSecondary
                onClick={() => signOut()}
                className="!border-white !text-white hover:!bg-white hover:!text-primary"
              >
                Uitloggen
              </ButtonSecondary>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-white border-opacity-20 mt-4 pt-4">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-white text-primary"
                        : "text-white hover:bg-white hover:bg-opacity-10"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/app/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    pathname === "/app/cart"
                      ? "bg-white text-primary"
                      : "text-white hover:bg-white hover:bg-opacity-10"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Winkelwagen
                  {getTotalItems() > 0 && (
                    <span className="absolute top-2 right-2 bg-accent text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 rounded-md text-sm font-medium text-white border-2 border-white hover:bg-white hover:text-primary transition-colors text-left"
                >
                  Uitloggen
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}







