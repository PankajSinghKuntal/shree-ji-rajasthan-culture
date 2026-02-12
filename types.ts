
export enum Category {
  CLOTHES = 'Clothes',
  JEWELLERY = 'Jewellery',
  FLOWER_TEA = 'Flower Tea',
  HOME_DECOR = 'Home Decor'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}
export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
}