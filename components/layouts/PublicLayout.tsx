"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import ButtonPrimary from "../ui/ButtonPrimary";
import PaymentLogo from "../ui/PaymentLogo";
import { paymentMethods } from "@/config/payments";
import { Circle, Menu, X } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [logoError, setLogoError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center ml-4 md:-ml-8 mt-2">
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
            <nav className="hidden md:flex items-center gap-4">
              {session ? (
                <>
                  <Link href="/app" className="text-white hover:text-accent transition-colors font-medium">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-white hover:text-accent transition-colors font-medium"
                  >
                    Uitloggen
                  </button>
                </>
              ) : (
                <>
                  <Link href="/contact">
                    <button className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary px-6 py-3 rounded-lg font-semibold transition-colors uppercase">
                      CONTACT MET ONS OPNEMEN
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors uppercase">
                      CONNECTIE MAKEN
                    </button>
                  </Link>
                </>
              )}
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
              <nav className="flex flex-col gap-4">
                {session ? (
                  <>
                    <Link 
                      href="/app" 
                      className="text-white hover:text-accent transition-colors font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="text-white hover:text-accent transition-colors font-medium text-left"
                    >
                      Uitloggen
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <button className="w-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary px-6 py-3 rounded-lg font-semibold transition-colors uppercase">
                        CONTACT MET ONS OPNEMEN
                      </button>
                    </Link>
                    <Link 
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <button className="w-full bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors uppercase">
                        CONNECTIE MAKEN
                      </button>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Over ons</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/over-ons" className="hover:text-accent">Over ons</Link>
                </li>
                <li>
                  <Link href="/algemene-voorwaarden" className="hover:text-accent">Algemene voorwaarden</Link>
                </li>
                <li>
                  <Link href="/privacybeleid" className="hover:text-accent">Privacybeleid</Link>
                </li>
                <li>
                  <Link href="/nieuws" className="hover:text-accent">Nieuws</Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-4">
                <span className="text-2xl font-bold">Bandendepot.com</span>
              </div>
              <div className="flex gap-4 mb-4 flex-wrap">
                {paymentMethods.map((payment) => (
                  <PaymentLogo
                    key={payment.slug}
                    name={payment.name}
                    slug={payment.slug}
                    logoSrc={payment.logo}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Snelle Levering
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Veilig Betalen
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  B2B Specials
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white border-opacity-20 text-center text-gray-300">
            <p>&copy; 2024 Bandendepot.com | Alle rechten voorbehouden.</p>
            <a
              href="https://axaweb.nl"
              target="_blank"
              rel="noopener noreferrer"
              title="Powered by AxaWeb"
              className="mt-3 inline-flex items-center gap-2 text-sm hover:text-accent"
            >
              Powered by
              <img
                src="https://axaweb.nl/apple-touch-icon.png?v=3"
                alt="AxaWeb"
                width={20}
                height={20}
                className="w-5 h-5 rounded"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}







