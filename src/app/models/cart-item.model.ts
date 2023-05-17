import { Product } from "./product.model";

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product | undefined;
  price: number;
  id?: string;
}