import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface RetailerDashboardProps {
  userId: string;
  onLogout: () => void;
}

const RetailerDashboard: React.FC<RetailerDashboardProps> = ({ userId, onLogout }) => {
  const navigate = useNavigate();
  const [shopData, setShopData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [demands, setDemands] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    category: '',
    price: 0,
    quantity: 0
  });

  useEffect(() => {
    fetchRetailerData();
  }, [userId]);

  const fetchRetailerData = async () => {
    try {
      const shopResponse = await axios.get(`/api/retailers/shop/${userId}`);
      setShopData(shopResponse.data);

      const productsResponse = await axios.get(`/api/retailers/products/${shopResponse.data._id}`);
      setProducts(productsResponse.data);

      const demandsResponse = await axios.get(`/api/retailers/demands/${shopResponse.data._id}`);
      setDemands(demandsResponse.data);

      const analyticsResponse = await axios.get(`/api/analytics/sales/${shopResponse.data._id}`);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Error fetching retailer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/retailers/product/add', {
        ...newProduct,
        shopId: shopData._id
      });
      setNewProduct({ productName: '', category: '', price: 0, quantity: 0 });
      setShowAddProduct(false);
      fetchRetailerData();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-600">RetailYou</h1>
            <p className="text-gray-600">{shopData?.shopName || 'Retailer Dashboard'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Total Products</p>
              <p className="text-3xl font-bold text-purple-600">{analytics.totalProducts}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Inventory Value</p>
              <p className="text-3xl font-bold text-blue-600">₹{analytics.totalValue?.toFixed(0)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Customer Demands</p>
              <p className="text-3xl font-bold text-green-600">{demands.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600 text-sm">Health Score</p>
              <p className="text-3xl font-bold text-orange-600">85%</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {['dashboard', 'products', 'demands', 'suppliers'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold capitalize ${activeTab === tab ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Shop Information</h2>
              {shopData && (
                <div className="space-y-3">
                  <p><span className="font-semibold">Shop Name:</span> {shopData.shopName}</p>
                  <p><span className="font-semibold">Category:</span> {shopData.category}</p>
                  <p><span className="font-semibold">Location:</span> {shopData.address}</p>
                  <p><span className="font-semibold">Hours:</span> {shopData.openingHours} - {shopData.closingHours}</p>
                  <p><span className="font-semibold">Rating:</span> ⭐ {shopData.rating}/5</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <button
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              + Add Product
            </button>

            {showAddProduct && (
              <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-lg shadow space-y-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add Product
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-lg font-bold text-gray-800">{product.productName}</h3>
                  <p className="text-gray-600 text-sm">{product.category}</p>
                  <div className="mt-3 space-y-1">
                    <p><span className="font-semibold">Price:</span> ₹{product.price}</p>
                    <p><span className="font-semibold">Quantity:</span> {product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demands Tab */}
        {activeTab === 'demands' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Demands</h2>
            {demands.length > 0 ? (
              <div className="space-y-4">
                {demands.map(demand => (
                  <div key={demand._id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-bold text-lg">{demand.productName}</p>
                      <p className="text-gray-600 text-sm">{demand.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl text-red-600">{demand.requestCount}</p>
                      <p className="text-gray-600 text-sm">requests</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No customer demands yet</p>
            )}
          </div>
        )}

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Recommended Suppliers</h2>
            <p className="text-gray-600 mb-4">Connect with trusted suppliers to grow your business</p>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg">Fresh Foods Co</h3>
                <p className="text-gray-600">Groceries & Food Items</p>
                <p className="mt-2 text-sm">⭐ 4.8 rating | Min Order: ₹500 | Delivery: 2 days</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg">Premium Clothing Inc</h3>
                <p className="text-gray-600">Clothing & Apparel</p>
                <p className="mt-2 text-sm">⭐ 4.5 rating | Min Order: ₹1000 | Delivery: 3 days</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RetailerDashboard;