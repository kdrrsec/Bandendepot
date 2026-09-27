"use client";

import PublicLayout from "@/components/layouts/PublicLayout";
import Card from "@/components/ui/Card";
import FormInput from "@/components/ui/FormInput";
import ButtonPrimary from "@/components/ui/ButtonPrimary";

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="bg-neutral-light py-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Neem Contact Op
            </h1>
            <p className="text-lg text-gray-600">
              Heeft u vragen? Neem gerust contact met ons op.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Contactgegevens
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Telefoon</h3>
                  <p className="text-gray-600">+31 20 123 4567</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-gray-600">info@bandendepot.com</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Openingstijden</h3>
                  <p className="text-gray-600">
                    Maandag - Vrijdag: 08:00 - 18:00
                    <br />
                    Zaterdag: 09:00 - 17:00
                    <br />
                    Zondag: Gesloten
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Adres</h3>
                  <p className="text-gray-600">
                    Bandendepot.com
                    <br />
                    Amsterdam, Nederland
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                Stuur een Bericht
              </h2>
              <form className="space-y-4">
                <FormInput label="Naam" type="text" required />
                <FormInput label="Email" type="email" required />
                <FormInput label="Onderwerp" type="text" required />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bericht
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={5}
                    required
                  />
                </div>
                <ButtonPrimary type="submit" className="w-full">
                  Versturen
                </ButtonPrimary>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}











