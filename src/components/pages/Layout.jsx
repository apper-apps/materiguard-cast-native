import { Navigate, Outlet, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useContext } from "react";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import Remises from "@/components/pages/Remises";
import Stock from "@/components/pages/Stock";
import Emprunts from "@/components/pages/Emprunts";
import Historique from "@/components/pages/Historique";
import MonCompte from "@/components/pages/MonCompte";

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
              {user?.role || 'Utilisateur'}
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
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/remises" element={<Remises />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/emprunts" element={<Emprunts />} />
            <Route path="/historique" element={<Historique />} />
            <Route path="/mon-compte" element={<MonCompte />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
export default Layout;