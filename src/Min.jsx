import { Search, Bell, Home, Sprout, Plus, User, FileText, Stethoscope, MessageSquare, Calculator, CheckCircle, PlusCircle } from 'lucide-react';

const MinimalPage = ({ title }) => (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button 
          onClick={() => setCurrentPage('home')}
          className="text-blue-400"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
        <div></div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-400">This page is under development</p>
        </div>
      </div>
    </div>
  );
  export default MinimalPage;