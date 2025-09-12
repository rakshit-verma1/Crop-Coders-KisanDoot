  import React from 'react';
  import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
  import { Search, Bell, Home, Sprout, Plus, User, FileText, Stethoscope, MessageSquare, Calculator, CheckCircle, PlusCircle } from 'lucide-react';
import MyCropPage from './pages/MyCropPage';
import CreatePage from './pages/CreatePage';
import ProfilePage from './pages/ProfilePage';
import CalculatorA from './Calculator';
import FarmerChatbot from './Chatbot';
import HomePage from './Home';
import DoctorAdvicePage from './pages/DoctorAdvice';
import CropStudyPage from './pages/CropStudyPage';
  // Bottom Navigation Component
  const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Map paths to navigation items
    const navigationItems = [
      { path: '/', icon: Home, label: 'Home' },
      { path: '/mycrop', icon: Sprout, label: 'My Crop' },
      { path: '/create', icon: Plus, label: 'Create' },
      { path: '/profile', icon: User, label: 'Profile' }
    ];

    const handleNavigation = (path) => {
      navigate(path);
    };

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
        <div className="flex justify-around py-2">
          {navigationItems.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => handleNavigation(path)}
              className={`flex flex-col items-center py-2 px-4 ${
                location.pathname === path ? 'text-green-400' : 'text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Layout Component that includes the bottom navigation
  const Layout = ({ children }) => {
    return (
      <div className="max-w-md mx-auto bg-gray-900 min-h-screen relative">
        {children}
        <BottomNavigation />
      </div>
    );
  };

  // Main App Component with Routes
const KisaanDootApp = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mycrop" element={<MyCropPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/calculator" element={<CalculatorA />} />
          <Route path="/chatbot" element={<FarmerChatbot />} />
          <Route path="/doctor" element={<DoctorAdvicePage />} />
<Route path="/cropstudy" element={<CropStudyPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

  export default KisaanDootApp;
