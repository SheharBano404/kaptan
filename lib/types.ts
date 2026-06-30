export type Category =
  | "rashguards"
  | "fight-shorts"
  | "leather-jackets"
  | "racing-suits";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number; // GBP
  compareAt?: number; // original price (for sale strikethrough)
  description: string;
  details: string[];
  images: string[];
  sizes: string[];
  colors?: string[];
  badge?: string;
  featured?: boolean;
  stock: number;
}

export interface CartLine {
  id: string; // productId + size
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  items: CartLine[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
  };
}

export const CATEGORY_META: Record<
  Category,
  { label: string; blurb: string; image: string }
> = {
  "leather-jackets": {
    label: "Leather Jackets",
    blurb: "Hand-finished hides. Built to outlast trends.",
    image: "/products/crimson-edge-1.jpeg",
  },
  "racing-suits": {
    label: "Racing Suits",
    blurb: "Track-grade one & two-piece leathers.",
    image: "/products/apex-pro-suit.jpeg",
  },
  rashguards: {
    label: "Rashguards",
    blurb: "Sublimated compression fightwear.",
    image: "/products/gear5-front.jpeg",
  },
  "fight-shorts": {
    label: "Fight Shorts",
    blurb: "4-way stretch grappling shorts.",
    image: "/products/symbiote-shorts-front.jpeg",
  },
};

export const CATEGORY_ORDER: Category[] = [
  "leather-jackets",
  "racing-suits",
  "rashguards",
  "fight-shorts",
];
