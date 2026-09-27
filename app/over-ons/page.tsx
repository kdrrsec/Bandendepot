"use client";

import PublicLayout from "@/components/layouts/PublicLayout";
import Card from "@/components/ui/Card";

export default function OverOnsPage() {
  return (
    <PublicLayout>
      <div className="bg-neutral-light py-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Over Ons</h1>
            <p className="text-lg text-gray-600">
              Uw betrouwbare partner in banden en onderdelen
            </p>
          </div>

          <Card className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Wie zijn wij?</h2>
            <p className="text-gray-700 mb-4">
              Bandendepot.com is de toonaangevende B2B groothandel voor banden en onderdelen in Nederland. 
              Met meer dan 300 merken en duizenden producten bieden wij groothandelaren en dealers de beste 
              prijzen en service.
            </p>
            <p className="text-gray-700 mb-4">
              Ons platform is exclusief voor goedgekeurde B2B-klanten. Wij begrijpen de behoeften van 
              professionals in de automotive branche en bieden daarom een uitgebreide catalogus met scherpe 
              groothandelstarieven.
            </p>
            <p className="text-gray-700">
              Sinds onze oprichting hebben wij duizenden dealers geholpen om hun winstmarges te optimaliseren 
              door toegang te bieden tot de beste prijzen en een uitgebreid assortiment.
            </p>
          </Card>

          <Card className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Onze Missie</h2>
            <p className="text-gray-700 mb-4">
              Onze missie is om professionals in de automotive branche te voorzien van hoogwaardige banden 
              en onderdelen tegen de scherpste groothandelsprijzen. Wij streven ernaar om uw betrouwbare 
              partner te zijn door:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Uitgebreid assortiment van meer dan 300 merken</li>
              <li>Competitieve groothandelsprijzen</li>
              <li>Betrouwbare levering en service</li>
              <li>Dagelijkse marktprijsinformatie</li>
              <li>Exclusieve B2B platform voor professionals</li>
            </ul>
          </Card>

          <Card className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Waarom Bandendepot.com?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Uitgebreid Assortiment</h3>
                <p className="text-gray-700">
                  Meer dan 300 merken en duizenden producten beschikbaar voor uw klanten.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Scherpe Prijzen</h3>
                <p className="text-gray-700">
                  Groothandelstarieven die uw winstmarges optimaliseren.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Betrouwbare Service</h3>
                <p className="text-gray-700">
                  Snelle levering en professionele klantenservice.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-primary">Marktprijsinformatie</h3>
                <p className="text-gray-700">
                  Blijf op de hoogte van de laatste marktprijzen per dag.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Contact</h2>
            <p className="text-gray-700 mb-4">
              Heeft u vragen of wilt u meer informatie? Neem gerust contact met ons op via het 
              contactformulier of bel ons direct.
            </p>
            <a href="/contact" className="text-primary hover:text-accent font-semibold">
              Neem contact met ons op →
            </a>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}





