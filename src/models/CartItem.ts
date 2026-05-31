import { Product } from "~/models/Product";

export type CartItem = {
  product: Product;
  count: number;
};

export type CartApiItem = {
  id: string;
  product_id: string;
  count: number;
};
