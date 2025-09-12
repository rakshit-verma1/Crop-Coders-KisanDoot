import { Search, Bell, Sprout, FileText, Stethoscope, MessageSquare, Calculator, CheckCircle, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
          <div className="text-gray-800 text-xs font-bold">🌾</div>
        </div>
        <h1 className="text-xl font-bold tracking-wide">KISAANDOOT</h1>
        <Bell className="w-6 h-6" />
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-400 border-none outline-none focus:bg-gray-600 transition-colors"
          />
        </div>
      </div>

      {/* App Icons */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <div className="w-8 h-8 bg-green-800 rounded-sm flex items-center justify-center">
                <div className="text-white text-xs font-bold">M</div>
              </div>
            </div>
            <span className="text-sm text-center">Ministry</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm text-center">KisaanDoot</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <div className="text-white text-sm font-bold">AN</div>
            </div>
            <span className="text-sm text-center">AgriNews</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mb-2 shadow-lg">
              <div className="text-white text-xl">☀️</div>
            </div>
            <span className="text-sm text-center">Weather</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Crop Study */}
          <button
            className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 h-32 relative overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
            onClick={() => navigate("/cropstudy")}
          >
            <div className="absolute bottom-4 right-4 opacity-80">
              <FileText className="w-10 h-10 text-green-800" style={{ transform: 'rotate(-15deg)' }} />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">Crop Study</h3>
              <p className="text-gray-800 text-sm">Learn about crops</p>
            </div>
          </button>

          {/* Doctor */}
          <button
            className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 h-32 relative overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
            onClick={() => navigate("/doctor")}
          >
            <div className="absolute bottom-4 right-4">
              <Stethoscope className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">Doctor</h3>
              <p className="text-gray-700 text-sm">Get expert advice</p>
            </div>
          </button>

          {/* Chatbot */}
          <button
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 h-32 relative overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
            onClick={() => navigate("/chatbot")}
          >
            <div className="absolute bottom-4 right-4">
              <MessageSquare className="w-10 h-10 text-purple-200" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Chatbot</h3>
              <p className="text-purple-100 text-sm">AI assistance</p>
            </div>
          </button>

          {/* Calculator */}
          <button
            className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 h-32 relative overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-left"
            onClick={() => navigate("/calculator")}
          >
            <div className="absolute bottom-4 right-4">
              <Calculator className="w-10 h-10 text-orange-500" />
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-1">Calculator</h3>
              <p className="text-gray-700 text-sm">Financial planning</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mb-20">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 bg-gray-800 rounded-lg p-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-md">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Task completed: Water the tomatoes</p>
              <p className="text-gray-400 text-sm">2 hours ago</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-gray-800 rounded-lg p-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-md">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">New crop plan created: Wheat</p>
              <p className="text-gray-400 text-sm">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
