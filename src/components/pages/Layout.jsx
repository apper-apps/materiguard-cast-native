import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useContext } from "react";
import { AuthContext } from "../../App";
import React from "react";
import Sidebar from "@/components/organisms/Sidebar";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Connecté en tant que:</span>
            <span className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</span>
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              Utilisateur
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ApperIcon name="LogOut" className="w-4 h-4" />
            <span>Déconnexion</span>
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