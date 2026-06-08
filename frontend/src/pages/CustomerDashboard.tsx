import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface CustomerDashboardProps {
  userId: string;
  onLogout: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ userId, onLogout }) => {
  const navigate = useNavigate();
  const [shops, setShops] = useState<any[]>([]);
  const [activitySummary, setActivitySummary] = useState<any>(null);
  const [userLocation, setUserLocation] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('shops');

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          fetchNearbyShops(latitude, longitude);
        },
        (error) => console.error('Location error:', error)
      );
    }
    fetchActivitySummary();
  }, [userId]);

  const fetchNearbyShops = async (lat: number, lon: number) => {
    try {
      const response = await axios.post('/api/products/nearby-shops', {
        latitude: lat,
        longitude: lon,
        radiusKm: 5
      });
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivitySummary = async () => {
    try {
      const response = await axios.get(`/api/users/activity/daily/${userId}`);
      setActivitySummary(response.data);
    } catch (error) {
      console.error('Error fetching activity:', error);
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
          <h1 className="text-3xl font-bold text-purple-600">RetailYou</h1>
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
        {/* Activity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Steps Today</p>
            <p className="text-3xl font-bold text-purple-600">{activitySummary?.totalSteps || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Calories Burned</p>
            <p className="text-3xl font-bold text-blue-600">{activitySummary?.totalCalories || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Distance (km)</p>
            <p className="text-3xl font-bold text-green-600">{(activitySummary?.totalDistance || 0).toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Activity Count</p>
            <p className="text-3xl font-bold text-orange-600">{activitySummary?.activityCount || 0}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('shops')}
            className={`px-6 py-2 rounded-lg font-semibold ${activeTab === 'shops' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
          >
            Nearby Shops
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-2 rounded-lg font-semibold ${activeTab === 'activity' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
          >
            My Activity
          </button>
        </div>

        {/* Nearby Shops */}
        {activeTab === 'shops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="col-span-full text-center text-gray-600">Loading shops...</p>
            ) : shops.length > 0 ? (
              shops.map((shop) => (
                <div key={shop._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-32"></div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800">{shop.shopName}</h3>
                    <p className="text-gray-600 text-sm">{shop.category}</p>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm">📍 {shop.distance?.toFixed(2)} km away</p>
                      <p className="text-sm">⏱️ {shop.walkingTime} mins walk</p>
                      <p className="text-sm">⭐ {shop.rating} rating</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Walk 🚶
                      </button>
                      {shop.deliveryAvailable && (
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          Order 🚚
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-600">No shops found nearby</p>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">My Daily Activity</h2>
            {activitySummary ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Total Steps</span>
                  <span className="text-2xl font-bold text-purple-600">{activitySummary.totalSteps}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Calories Burned</span>
                  <span className="text-2xl font-bold text-blue-600">{activitySummary.totalCalories}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Distance Covered</span>
                  <span className="text-2xl font-bold text-green-600">{activitySummary.totalDistance.toFixed(2)} km</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold">Activities</span>
                  <span className="text-2xl font-bold text-orange-600">{activitySummary.activityCount}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No activity data yet</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;