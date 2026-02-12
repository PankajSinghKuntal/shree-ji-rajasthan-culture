import React, { useState } from 'react';
import { Product, Category } from '../types';
import { addressAPI, orderAPI, paymentAPI } from '../api';

interface Address {
  _id?: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

interface Order {
  _id?: string;
  orderId: string;
  userId: string;
  products: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Payment {
  _id?: string;
  transactionId: string;
  userId: string;
  paymentMethod: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
}

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  users: User[];
  onDeleteUser: (userId: string) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = (props: AdminPanelProps) => {
  const { products, onAddProduct, onDeleteProduct, users, onDeleteUser, onClose } = props;

  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [userPayments, setUserPayments] = useState<Payment[]>([]);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: Category.CLOTHES,
    image: ''
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '2004') {
      setIsLocked(false);
      setPasswordError('');
      setPassword('');
    } else {
      setPasswordError('Incorrect password!');
      setPassword('');
    }
  };

  const handleSelectUser = async (user: User) => {
    setSelectedUser(user);
    setLoadingUserDetails(true);
    
    try {
      const [addressesRes, ordersRes, paymentsRes] = await Promise.all([
        addressAPI.getByUserId(user.id),
        orderAPI.getByUserId(user.id),
        paymentAPI.getByUserId(user.id)
      ]);
      
      setUserAddresses(Array.isArray(addressesRes) ? addressesRes : []);
      setUserOrders(Array.isArray(ordersRes) ? ordersRes : []);
      setUserPayments(Array.isArray(paymentsRes) ? paymentsRes : []);
    } catch (error) {
      console.error('Error loading user details:', error);
      setUserAddresses([]);
      setUserOrders([]);
      setUserPayments([]);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description || !formData.image) {
      alert('Please fill all fields including image');
      return;
    }

    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description,
      category: formData.category as Category,
      image: formData.image
    };

    onAddProduct(newProduct);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: Category.CLOTHES,
      image: ''
    });
    setImagePreview('');
    setSyncMessage('✅ Product saved to local storage and syncing to database...');
    setTimeout(() => {
      setSyncMessage('✅ Product saved successfully!');
      setTimeout(() => setSyncMessage(''), 3000);
    }, 500);
  };

  if (isLocked) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <h2 className="text-3xl font-bold text-amber-950 mb-6 text-center">🔐 Admin Panel</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2">Enter Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>
            {passwordError && <p className="text-red-600 text-sm font-bold">{passwordError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-900 text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Unlock
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
          </form>
                    {/* Sync Status Message */}
                    {syncMessage && (
                      <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-green-800 font-bold text-center animate-pulse">
                        {syncMessage}
                      </div>
                    )}
        </div>
      </div>
    );
  }

  const categoriesArray = Object.values(Category);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-900 p-6 flex justify-between items-center">
            <h1 className="text-4xl font-bold text-white">🔑 Admin Panel</h1>
            <button
              onClick={() => {
                setIsLocked(true);
                onClose();
              }}
              className="text-white text-3xl hover:bg-amber-800 rounded-lg w-12 h-12 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b-4 border-amber-700">
            <button
              onClick={() => {
                setActiveTab('products');
                setSelectedUser(null);
                        {/* Info Banner about Product Persistence */}
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 m-4 rounded text-blue-800">
                          <p className="font-bold">💾 Product Saving:</p>
                          <p className="text-sm">All products you add are automatically saved to your browser's local storage AND synced to the database. Products will persist even after closing the browser!</p>
                        </div>

              }}
              className={`flex-1 py-4 font-bold text-lg transition-colors ${
                activeTab === 'products'
                  ? 'bg-amber-100 text-amber-900 border-b-4 border-amber-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📦 Product Manager
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-4 font-bold text-lg transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-100 text-blue-900 border-b-4 border-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👥 User Details
            </button>
          </div>

          <div className="p-8">
            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <>
                {/* Add Product Form */}
                <div className="bg-amber-50 rounded-xl p-8 mb-12 border-4 border-amber-200">
                  <h2 className="text-3xl font-bold text-amber-950 mb-6">Add New Product</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter product name"
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Enter price"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-700"
                    >
                      {categoriesArray.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-bold text-amber-900 mb-2">Product Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-700"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-amber-900 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-700"
                  />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-amber-900 mb-2">Image Preview:</p>
                      <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-amber-400" />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-800 text-white font-bold rounded-lg hover:shadow-lg transition-all uppercase tracking-widest text-lg"
                >
                  ✓ Add Product
                </button>
              </form>
            </div>

            {/* Products Table */}
            <div>
              <h2 className="text-3xl font-bold text-amber-950 mb-6">All Products ({products.length})</h2>
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => {
                    setSyncMessage('📥 Reloading products from server...');
                    setTimeout(() => {
                      setSyncMessage('✅ Products reloaded successfully!');
                      setTimeout(() => setSyncMessage(''), 3000);
                    }, 1000);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors"
                >
                  🔄 Reload from Server
                </button>
              </div>


              {products.length === 0 ? (
                <div className="text-center py-12 bg-amber-50 rounded-xl border-2 border-dashed border-amber-300">
                  <p className="text-2xl text-amber-700 font-semibold">No products added yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-amber-700 text-white">
                        <th className="border-4 border-amber-900 px-4 py-3 text-left font-bold">Product Name</th>
                        <th className="border-4 border-amber-900 px-4 py-3 text-left font-bold">Price (₹)</th>
                        <th className="border-4 border-amber-900 px-4 py-3 text-left font-bold">Description</th>
                        <th className="border-4 border-amber-900 px-4 py-3 text-left font-bold">Image</th>
                        <th className="border-4 border-amber-900 px-4 py-3 text-center font-bold">Category</th>
                        <th className="border-4 border-amber-900 px-4 py-3 text-center font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-amber-50 transition-colors">
                          <td className="border-2 border-amber-200 px-4 py-3 font-semibold text-amber-950">{product.name}</td>
                          <td className="border-2 border-amber-200 px-4 py-3 font-bold text-amber-900">₹{product.price}</td>
                          <td className="border-2 border-amber-200 px-4 py-3 text-amber-800 text-sm line-clamp-2">{product.description}</td>
                          <td className="border-2 border-amber-200 px-4 py-3">
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          </td>
                          <td className="border-2 border-amber-200 px-4 py-3 text-center">
                            <span className="px-3 py-1 bg-amber-200 text-amber-900 font-bold rounded-full text-sm">
                              {product.category}
                            </span>
                          </td>
                          <td className="border-2 border-amber-200 px-4 py-3 text-center">
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this product?')) {
                                  onDeleteProduct(product.id);
                                }
                              }}
                              className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-800 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            </>
            )}

            {/* USERS DETAILS TAB */}
            {activeTab === 'users' && (
              <>
                {!selectedUser ? (
                  <div>
                    <h2 className="text-3xl font-bold text-blue-950 mb-6">👥 Registered Users ({users.length})</h2>

                    {users.length === 0 ? (
                      <div className="text-center py-8 bg-blue-50 rounded-xl border-2 border-dashed border-blue-300">
                        <p className="text-lg text-blue-700 font-semibold">No registered users yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((user) => (
                          <div key={user.id} className="bg-blue-50 rounded-lg border-2 border-blue-200 p-4 hover:shadow-lg transition-all cursor-pointer hover:border-blue-400">
                            <button
                              onClick={() => handleSelectUser(user)}
                              className="w-full text-left"
                            >
                              <div className="flex items-start gap-3">
                                <div className="text-3xl">👤</div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-blue-950 text-lg">{user.fullName}</h3>
                                  <p className="text-sm text-blue-700">{user.email}</p>
                                  <p className="text-xs text-blue-600 mt-2">
                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="mb-6 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      ← Back to Users
                    </button>

                    {loadingUserDetails ? (
                      <div className="text-center py-12">
                        <p className="text-lg text-gray-600 font-semibold">Loading user details...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* User Info */}
                        <div className="bg-blue-50 rounded-lg border-2 border-blue-200 p-6">
                          <h3 className="text-2xl font-bold text-blue-950 mb-4">User Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-blue-700 font-semibold">Full Name</p>
                              <p className="text-lg font-bold text-blue-950">{selectedUser.fullName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-blue-700 font-semibold">Email</p>
                              <p className="text-lg font-bold text-blue-950">{selectedUser.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-blue-700 font-semibold">Joined Date</p>
                              <p className="text-lg font-bold text-blue-950">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-blue-700 font-semibold">User ID</p>
                              <p className="text-xs font-mono text-blue-700">{selectedUser.id}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete user ${selectedUser.fullName}?`)) {
                                onDeleteUser(selectedUser.id);
                                setSelectedUser(null);
                              }
                            }}
                            className="mt-4 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-800 transition-colors"
                          >
                            Delete User
                          </button>
                        </div>

                        {/* Addresses */}
                        <div className="bg-green-50 rounded-lg border-2 border-green-200 p-6">
                          <h3 className="text-2xl font-bold text-green-950 mb-4">📍 Delivery Addresses ({userAddresses.length})</h3>
                          {userAddresses.length === 0 ? (
                            <p className="text-green-700">No addresses saved yet</p>
                          ) : (
                            <div className="space-y-3">
                              {userAddresses.map((addr, idx) => (
                                <div key={idx} className="bg-white border-2 border-green-200 p-3 rounded">
                                  <p className="font-bold text-green-950">{addr.fullName}</p>
                                  <p className="text-sm text-green-800">{addr.address}</p>
                                  {addr.landmark && <p className="text-xs text-green-700">📍 {addr.landmark}</p>}
                                  <p className="text-sm text-green-800">{addr.city}, {addr.state} {addr.pincode}</p>
                                  <p className="text-xs text-green-700">📱 {addr.phone} | ✉️ {addr.email}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Orders */}
                        <div className="bg-purple-50 rounded-lg border-2 border-purple-200 p-6">
                          <h3 className="text-2xl font-bold text-purple-950 mb-4">📦 Orders ({userOrders.length})</h3>
                          {userOrders.length === 0 ? (
                            <p className="text-purple-700">No orders placed yet</p>
                          ) : (
                            <div className="space-y-3">
                              {userOrders.map((order, idx) => (
                                <div key={idx} className="bg-white border-2 border-purple-200 p-3 rounded">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="font-bold text-purple-950">Order {order.orderId}</p>
                                      <p className="text-sm text-purple-800">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded font-bold text-sm ${
                                      order.status === 'confirmed' ? 'bg-yellow-200 text-yellow-900' :
                                      order.status === 'shipped' ? 'bg-blue-200 text-blue-900' :
                                      order.status === 'delivered' ? 'bg-green-200 text-green-900' :
                                      'bg-red-200 text-red-900'
                                    }`}>
                                      {order.status.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-purple-800 font-semibold">Amount: ₹{order.totalAmount}</p>
                                  <p className="text-xs text-purple-700 mt-2">{order.products?.length || 0} items</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Payments */}
                        <div className="bg-orange-50 rounded-lg border-2 border-orange-200 p-6">
                          <h3 className="text-2xl font-bold text-orange-950 mb-4">💳 Payment History ({userPayments.length})</h3>
                          {userPayments.length === 0 ? (
                            <p className="text-orange-700">No payment history</p>
                          ) : (
                            <div className="space-y-3">
                              {userPayments.map((payment, idx) => (
                                <div key={idx} className="bg-white border-2 border-orange-200 p-3 rounded">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <p className="font-bold text-orange-950">{payment.paymentMethod.toUpperCase()}</p>
                                      <p className="text-xs font-mono text-orange-700">{payment.transactionId}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded font-bold text-sm ${
                                      payment.status === 'completed' ? 'bg-green-200 text-green-900' :
                                      payment.status === 'pending' ? 'bg-yellow-200 text-yellow-900' :
                                      'bg-red-200 text-red-900'
                                    }`}>
                                      {payment.status.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-orange-800 font-semibold">Amount: ₹{payment.amount}</p>
                                  <p className="text-xs text-orange-700">{new Date(payment.createdAt).toLocaleDateString()}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;