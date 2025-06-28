import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Connecté en tant que:</span>
            <span className="font-medium text-gray-900">{user.username}</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              user.role === 'Administrator' ? 'bg-purple-100 text-purple-800' :
              user.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {user.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Déconnexion
          </button>
        </div>
        <main className="flex-1 overflow-auto">
          <Outlet />
</main>
      </div>
    </div>
  );
};

export default Layout;