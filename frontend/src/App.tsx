import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import './App.css';

function App() {
  const [userType, setUserType] = useState<'customer' | 'retailer' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleLogin = (type: 'customer' | 'retailer', id: string) => {
    setUserType(type);
    setIsLoggedIn(true);
    setUserId(id);
  };

  const handleLogout = () => {
    setUserType(null);
    setIsLoggedIn(false);
    setUserId(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route 
          path="/customer-dashboard" 
          element={isLoggedIn && userType === 'customer' ? <CustomerDashboard userId={userId!} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />} 
        />
        <Route 
          path="/retailer-dashboard" 
          element={isLoggedIn && userType === 'retailer' ? <RetailerDashboard userId={userId!} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;