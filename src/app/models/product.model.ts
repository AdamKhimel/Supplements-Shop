export interface Product {
  [x: string]: any;
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  showDescription?: boolean;
}
