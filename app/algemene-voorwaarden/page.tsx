"use client";

import PublicLayout from "@/components/layouts/PublicLayout";
import Card from "@/components/ui/Card";

export default function AlgemeneVoorwaardenPage() {
  return (
    <PublicLayout>
      <div className="bg-neutral-light py-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Algemene Voorwaarden</h1>
            <p className="text-lg text-gray-600">
              Laatste update: {new Date().getFullYear()}
            </p>
          </div>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">1. Algemeen</h2>
            <p className="text-gray-700 mb-4">
              Deze algemene voorwaarden zijn van toepassing op alle overeenkomsten tussen Bandendepot.com 
              en haar klanten. Door gebruik te maken van onze diensten, gaat u akkoord met deze voorwaarden.
            </p>
            <p className="text-gray-700">
              Bandendepot.com is een B2B platform exclusief voor goedgekeurde groothandelaren en dealers. 
              Alle prijzen zijn exclusief BTW, tenzij anders vermeld.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">2. Registratie en Account</h2>
            <p className="text-gray-700 mb-4">
              Om gebruik te maken van onze diensten, moet u een account aanmaken. U dient accurate en 
              volledige informatie te verstrekken. Bandendepot.com behoudt zich het recht voor om accounts 
              te weigeren of te deactiveren.
            </p>
            <p className="text-gray-700">
              U bent verantwoordelijk voor het geheimhouden van uw inloggegevens en voor alle activiteiten 
              die plaatsvinden onder uw account.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">3. Bestellingen en Levering</h2>
            <p className="text-gray-700 mb-4">
              Bestellingen worden pas definitief na onze bevestiging. Levertijden zijn indicatief en kunnen 
              variëren afhankelijk van beschikbaarheid en leveranciers.
            </p>
            <p className="text-gray-700 mb-4">
              Wij streven ernaar om alle bestellingen zo snel mogelijk te leveren, maar zijn niet aansprakelijk 
              voor vertragingen buiten onze controle.
            </p>
            <p className="text-gray-700">
              Levering geschiedt op het door u opgegeven adres. U bent verantwoordelijk voor het controleren 
              van de geleverde goederen bij ontvangst.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">4. Prijzen en Betaling</h2>
            <p className="text-gray-700 mb-4">
              Alle prijzen zijn in euro&apos;s en exclusief BTW. Prijzen kunnen zonder voorafgaande kennisgeving 
              worden gewijzigd, maar bestellingen die al zijn bevestigd blijven tegen de oorspronkelijke prijs.
            </p>
            <p className="text-gray-700">
              Betaling dient te geschieden volgens de overeengekomen betalingsvoorwaarden. Bij niet-betaling 
              behouden wij ons het recht voor om de levering op te schorten of de overeenkomst te ontbinden.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">5. Retourneren en Garantie</h2>
            <p className="text-gray-700 mb-4">
              Retourneren is alleen mogelijk na voorafgaande toestemming en binnen de gestelde termijnen. 
              Producten moeten onbeschadigd en in originele verpakking worden geretourneerd.
            </p>
            <p className="text-gray-700">
              Garantievoorwaarden zijn afhankelijk van de fabrikant en worden per product vermeld. Wij 
              fungeren als tussenpersoon voor garantieclaims.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">6. Aansprakelijkheid</h2>
            <p className="text-gray-700 mb-4">
              Bandendepot.com is niet aansprakelijk voor indirecte schade, gevolgschade of gederfde winst, 
              tenzij dit het gevolg is van opzet of grove schuld.
            </p>
            <p className="text-gray-700">
              Onze aansprakelijkheid is beperkt tot de waarde van de betrokken bestelling.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">7. Intellectueel Eigendom</h2>
            <p className="text-gray-700">
              Alle rechten op de inhoud van deze website, inclusief teksten, afbeeldingen en logo&apos;s, berusten 
              bij Bandendepot.com of haar licentiegevers. Gebruik zonder toestemming is niet toegestaan.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold mb-4 text-primary">8. Wijzigingen</h2>
            <p className="text-gray-700 mb-4">
              Bandendepot.com behoudt zich het recht voor om deze algemene voorwaarden te wijzigen. 
              Wijzigingen worden op deze pagina gepubliceerd en zijn van kracht vanaf de publicatiedatum.
            </p>
            <p className="text-gray-700">
              Voor vragen over deze voorwaarden kunt u contact met ons opnemen via het contactformulier.
            </p>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}





