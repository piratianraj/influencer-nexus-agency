
import React from 'react';
import { Link } from 'react-router-dom';

const DiscoveryHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-gray-900">InfluencerHub</Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/discovery" className="text-blue-600 font-medium">Discovery</Link>
            <Link to="/analytics" className="text-gray-700 hover:text-blue-600 font-medium">Analytics</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default DiscoveryHeader;
