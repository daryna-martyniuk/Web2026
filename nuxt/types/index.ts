export interface Feature {
  text: string;
  subtext?: string;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  savings: number;
  features: Feature[];
}

export interface Product {
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

export interface ProductsResponse {
  products: Product[];
}
export interface CheckoutForm {
  cardNumber: string;
  expiry: string;
  cvc: string;
  fullName: string;
  address: string;
  agreeToTerms: boolean;
}
