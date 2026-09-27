export interface PaymentMethod {
  name: string;
  slug: string;
  logo: string;
}

export const paymentMethods: PaymentMethod[] = [
  { name: "iDEAL", slug: "ideal", logo: "/images/payments/ideal.png" },
  { name: "Klarna", slug: "klarna", logo: "/images/payments/klarna.png" },
  { name: "American Express", slug: "amex", logo: "/images/payments/amex.png" },
  { name: "Maestro", slug: "maestro", logo: "/images/payments/maestro.png" },
];





