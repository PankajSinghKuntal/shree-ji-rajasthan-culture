import React, { useState, useEffect, useRef } from 'react';
import { Category, CartItem, Product } from './types';
import { PRODUCTS } from './products';
import { productAPI } from './api';
import Hero from './components/Hero';
import Categories from './components/Categories';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import Navbar from './components/Navbar';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';

interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
}

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showProducts, setShowProducts] = useState(false);
  
  // User authentication states
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    // Load users
    const savedUsers = localStorage.getItem('users');
    const savedCurrentUser = localStorage.getItem('currentUser');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }

    // Load products (mix of default and admin-added products)
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(PRODUCTS);
      }

      // Also fetch products from backend API to ensure sync
      const loadProductsFromAPI = async () => {
        try {
          const response = await productAPI.getAll();
          if (response.success && response.products && response.products.length > 0) {
            // Merge API products with localStorage products
            const apiProducts = response.products.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              description: p.description,
              category: p.category,
              image: p.image
            }));
          
            const currentLocal = savedProducts ? JSON.parse(savedProducts) : PRODUCTS;
            const mergedProducts = [...currentLocal];
          
            // Add API products that aren't in localStorage
            apiProducts.forEach((apiProduct: any) => {
              if (!mergedProducts.find(p => p.id === apiProduct.id)) {
                mergedProducts.push(apiProduct);
              }
            });
          
            setProducts(mergedProducts);
            localStorage.setItem('products', JSON.stringify(mergedProducts));
          }
        } catch (error) {
          console.error('Error loading products from API:', error);
        }
      };

    loadProductsFromAPI();
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Save products to localStorage whenever they change
  const isInitialProductsSave = useRef(true);
  useEffect(() => {
    if (isInitialProductsSave.current) {
      isInitialProductsSave.current = false;
      return;
    }
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  const handleAddProduct = async (product: Product) => {
    setProducts([...products, product]);
    
    // Sync with MongoDB
    try {
      await productAPI.add({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        addedBy: 'admin',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving product to database:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    
    // Sync with MongoDB
    try {
      await productAPI.delete(productId);
    } catch (error) {
      console.error('Error deleting product from database:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleLogin = (email: string, password: string, fullName?: string) => {
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      // Login mode - verify password
      if (existingUser.password === password) {
        setCurrentUser(existingUser);
        setIsAuthOpen(false);
        return true;
      } else {
        return false;
      }
    } else if (fullName) {
      // Signup mode - create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        fullName,
        email,
        password,
        createdAt: new Date().toISOString()
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setIsAuthOpen(false);
      return true;
    }
    
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    // If deleted user is current user, logout
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-white rajasthani-pattern">
      <Navbar 
        cartCount={cartItems.length} 
        onCartClick={() => setIsCartOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        currentUser={currentUser}
        onAuthClick={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {!showProducts ? (
        <>
          <Hero />
          <Categories
            onSelectCategory={(category: Category) => {
              setSelectedCategory(category);
              setShowProducts(true);
            }}
            onExploreMore={() => {
              setSelectedCategory(null);
              setShowProducts(true);
            }}
          />
        </>
      ) : (
        <ProductGrid
          products={filteredProducts}
          category={selectedCategory}
          onAddToCart={handleAddToCart}
          onBack={() => {
            setShowProducts(false);
            setSelectedCategory(null);
          }}
        />
      )}

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        total={cartTotal}
      />

      {isAdminOpen && (
        <AdminPanel
          products={products}
          onAddProduct={handleAddProduct}
          onDeleteProduct={handleDeleteProduct}
          users={users}
          onDeleteUser={handleDeleteUser}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLogin={handleLogin}
          allUsers={users}
        />
      )}
    </div>
  );
};

export default App;

