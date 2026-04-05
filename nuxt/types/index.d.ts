interface Feature {
  text: string;
  subtext?: string;
}

interface Plan {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  savings: number;
  features: Feature[];
}

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  brand?: string;
  price: number;
  rating: number;
  thumbnail: string;
  [key: string]: any;
}

interface ProductsResponse {
  products: Product[];
}
interface CheckoutForm {
  cardNumber: string;
  expiry: string;
  cvc: string;
  fullName: string;
  address: string;
  agreeToTerms: boolean;
}
