"use client";

import PublicLayout from "@/components/layouts/PublicLayout";
import Card from "@/components/ui/Card";

export default function PrivacybeleidPage() {
  return (
    <PublicLayout>
      <div className="bg-neutral-light py-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Privacybeleid</h1>
            <p className="text-lg text-gray-600">
              Laatste update: {new Date().getFullYear()}
            </p>
          </div>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">1. Inleiding</h2>
            <p className="text-gray-700 mb-4">
              Bandendepot.com hecht grote waarde aan de bescherming van uw privacy. Dit privacybeleid 
              beschrijft hoe wij omgaan met uw persoonsgegevens wanneer u gebruik maakt van onze diensten.
            </p>
            <p className="text-gray-700">
              Door gebruik te maken van onze website en diensten, gaat u akkoord met de verwerking van 
              uw gegevens zoals beschreven in dit privacybeleid.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">2. Gegevens die wij verzamelen</h2>
            <p className="text-gray-700 mb-4">
              Wij verzamelen de volgende gegevens wanneer u een account aanmaakt of gebruik maakt van 
              onze diensten:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Naam en contactgegevens (e-mailadres, telefoonnummer, adres)</li>
              <li>Bedrijfsgegevens (bedrijfsnaam, KVK-nummer, BTW-nummer)</li>
              <li>Bestel- en betalingsgegevens</li>
              <li>Technische gegevens (IP-adres, browser type, apparaat informatie)</li>
              <li>Gebruiksgegevens (pagina&apos;s bezocht, tijdstippen van bezoek)</li>
            </ul>
            <p className="text-gray-700">
              Wij verzamelen alleen gegevens die noodzakelijk zijn voor het verlenen van onze diensten 
              en het verbeteren van onze website.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">3. Doel van gegevensverwerking</h2>
            <p className="text-gray-700 mb-4">
              Wij gebruiken uw gegevens voor de volgende doeleinden:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Het verwerken en uitvoeren van uw bestellingen</li>
              <li>Het beheren van uw account en het verlenen van klantenservice</li>
              <li>Het verbeteren van onze diensten en website</li>
              <li>Het versturen van belangrijke informatie over uw account of bestellingen</li>
              <li>Het naleven van wettelijke verplichtingen</li>
              <li>Het voorkomen van fraude en misbruik</li>
            </ul>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">4. Delen van gegevens</h2>
            <p className="text-gray-700 mb-4">
              Wij delen uw gegevens alleen met derden wanneer dit noodzakelijk is voor:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Het uitvoeren van bestellingen (bijv. leveranciers, transportbedrijven)</li>
              <li>Het verwerken van betalingen (bijv. betaalproviders)</li>
              <li>Het naleven van wettelijke verplichtingen</li>
            </ul>
            <p className="text-gray-700">
              Wij verkopen of verhuren uw gegevens nooit aan derden voor marketingdoeleinden.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">5. Beveiliging</h2>
            <p className="text-gray-700 mb-4">
              Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen 
              tegen ongeautoriseerde toegang, verlies of vernietiging.
            </p>
            <p className="text-gray-700">
              Uw gegevens worden versleuteld verzonden en opgeslagen op beveiligde servers. Toegang tot 
              uw gegevens is beperkt tot geautoriseerd personeel dat deze gegevens nodig heeft voor het 
              uitvoeren van hun werkzaamheden.
            </p>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">6. Uw rechten</h2>
            <p className="text-gray-700 mb-4">
              U heeft de volgende rechten met betrekking tot uw persoonsgegevens:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Recht op inzage: u kunt opvragen welke gegevens wij van u hebben</li>
              <li>Recht op rectificatie: u kunt onjuiste gegevens laten corrigeren</li>
              <li>Recht op verwijdering: u kunt verzoeken om verwijdering van uw gegevens</li>
              <li>Recht op beperking: u kunt de verwerking van uw gegevens beperken</li>
              <li>Recht op dataportabiliteit: u kunt uw gegevens in een gestructureerd formaat ontvangen</li>
              <li>Recht van bezwaar: u kunt bezwaar maken tegen bepaalde verwerkingen</li>
            </ul>
          </Card>

          <Card className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-primary">7. Cookies</h2>
            <p className="text-gray-700 mb-4">
              Onze website gebruikt cookies om de functionaliteit te verbeteren en gebruikerservaring te 
              optimaliseren. U kunt cookies uitschakelen in uw browserinstellingen, maar dit kan de 
              functionaliteit van de website beperken.
            </p>
            <p className="text-gray-700">
              Wij gebruiken cookies voor authenticatie, het onthouden van voorkeuren, en het analyseren 
              van websitegebruik.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold mb-4 text-primary">8. Contact</h2>
            <p className="text-gray-700 mb-4">
              Voor vragen over dit privacybeleid of het uitoefenen van uw rechten, kunt u contact met 
              ons opnemen via het contactformulier of per e-mail.
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





