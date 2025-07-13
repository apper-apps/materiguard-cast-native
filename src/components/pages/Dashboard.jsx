import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import DashboardStats from "@/components/organisms/DashboardStats";
import EmpruntTable from "@/components/organisms/EmpruntTable";
import AlertsPanel from "@/components/organisms/AlertsPanel";
import Header from "@/components/organisms/Header";

const Dashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  return (
    <div className="h-full">
      <Header 
        title="Dashboard"
        subtitle="Vue d'ensemble de votre gestion de matériel"
      />
      
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DashboardStats />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <EmpruntTable />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AlertsPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;