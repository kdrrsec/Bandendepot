"use client";

import PublicLayout from "@/components/layouts/PublicLayout";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function NieuwsPage() {
  const newsItems = [
    {
      id: 1,
      title: "Nieuwe Merken Toegevoegd aan Ons Assortiment",
      date: "15 december 2024",
      excerpt: "We zijn verheugd om aan te kondigen dat we verschillende nieuwe merken hebben toegevoegd aan ons uitgebreide assortiment. Dit breidt onze catalogus uit met nog meer keuzemogelijkheden voor onze B2B klanten.",
      category: "Assortiment"
    },
    {
      id: 2,
      title: "Winterbanden Seizoen 2024-2025: Bestel Nu",
      date: "10 december 2024",
      excerpt: "Het winterseizoen is begonnen! Zorg dat u voorbereid bent met ons uitgebreide assortiment winterbanden. Bestel nu tegen scherpe groothandelsprijzen en profiteer van snelle levering.",
      category: "Seizoen"
    },
    {
      id: 3,
      title: "Nieuwe Marktprijsinformatie Tool Beschikbaar",
      date: "5 december 2024",
      excerpt: "Onze nieuwe marktprijsinformatie tool is nu beschikbaar voor alle geregistreerde gebruikers. Blijf op de hoogte van de laatste marktprijzen en optimaliseer uw inkoopstrategie.",
      category: "Platform"
    },
    {
      id: 4,
      title: "Verlengde Levertijden Tijdens Feestdagen",
      date: "1 december 2024",
      excerpt: "Tijdens de feestdagen kunnen levertijden iets langer zijn dan normaal. We raden aan om tijdig te bestellen om vertragingen te voorkomen. Onze klantenservice blijft beschikbaar voor al uw vragen.",
      category: "Service"
    },
    {
      id: 5,
      title: "Succesvolle Partnerschappen met Nieuwe Leveranciers",
      date: "25 november 2024",
      excerpt: "We hebben nieuwe strategische partnerschappen gesloten met toonaangevende leveranciers. Dit stelt ons in staat om nog betere prijzen en service te bieden aan onze B2B klanten.",
      category: "Partnerschappen"
    },
    {
      id: 6,
      title: "Platform Update: Verbeterde Gebruikerservaring",
      date: "20 november 2024",
      excerpt: "We hebben belangrijke updates doorgevoerd aan ons platform om de gebruikerservaring te verbeteren. Nieuwe filters, snellere zoekfunctie en verbeterde bestelproces maken het nog makkelijker om te werken met Bandendepot.com.",
      category: "Platform"
    }
  ];

  return (
    <PublicLayout>
      <div className="bg-neutral-light py-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Nieuws</h1>
            <p className="text-lg text-gray-600">
              Blijf op de hoogte van het laatste nieuws en updates van Bandendepot.com
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">{item.date}</span>
                </div>
                <h2 className="text-xl font-semibold mb-3 text-primary">
                  {item.title}
                </h2>
                <p className="text-gray-700 mb-4 flex-grow">
                  {item.excerpt}
                </p>
                <Link 
                  href={`/nieuws/${item.id}`}
                  className="text-primary hover:text-accent font-semibold text-sm"
                >
                  Lees meer →
                </Link>
              </Card>
            ))}
          </div>

          <Card className="mt-8 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Nieuwsbrief</h2>
            <p className="text-gray-700 mb-4">
              Wilt u op de hoogte blijven van het laatste nieuws en exclusieve aanbiedingen? 
              Schrijf u in voor onze nieuwsbrief.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Uw e-mailadres"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Inschrijven
              </button>
            </form>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}





