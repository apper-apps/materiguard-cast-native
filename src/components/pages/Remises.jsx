import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Header from '@/components/organisms/Header';
import RemiseForm from '@/components/organisms/RemiseForm';
import RemiseTable from '@/components/organisms/RemiseTable';

const Remises = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [showForm, setShowForm] = useState(false);
  const handleCreateRemise = () => {
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
  };

const headerActions = [];
  
  if (isAuthenticated && user?.role && (user.role === 'Administrator' || user.role === 'Manager')) {
    headerActions.push({
      label: 'Nouvelle remise',
      icon: 'Plus',
      onClick: handleCreateRemise,
      variant: 'primary'
    });
  }
  return (
    <div className="h-full">
      <Header 
        title="Remises de matériel"
        subtitle="Gérez les remises d'équipements aux agents"
        actions={headerActions}
      />
<div className="p-6">
        {showForm && isAuthenticated && user?.role && (user.role === 'Administrator' || user.role === 'Manager') ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <RemiseForm onSuccess={handleFormSuccess} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <RemiseTable />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Remises;