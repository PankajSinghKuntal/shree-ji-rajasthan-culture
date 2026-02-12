import { Product } from './types';

const KEYS = {
  PRODUCTS: 'shreeji_db_products_v1'
};

export const db = {
  // Product Operations
  getProducts: (): Product[] => {
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  
  saveProduct: (product: Product) => {
    try {
      const products = db.getProducts();
      products.push(product);
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving product:', e);
    }
  },

  deleteProduct: (productId: string) => {
    try {
      const products = db.getProducts();
      const filtered = products.filter(p => p.id !== productId);
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(filtered));
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  }
};
