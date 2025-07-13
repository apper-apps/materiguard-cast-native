import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import authService from '@/services/api/authService';
import userService from '@/services/api/userService';

const MonCompte = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Mot de passe modifié avec succès');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la modification du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="User" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Non connecté</h2>
          <p className="text-gray-600">Vous devez être connecté pour accéder à cette page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Header 
        title="Mon Compte"
        subtitle="Gérez vos informations personnelles et vos préférences"
      />
      
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Informations du profil */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Informations du profil</h3>
          </div>
          
          <div className="card-body">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-10 h-10 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h4>
                <p className="text-gray-600">{user.emailAddress}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {user.role || 'Utilisateur'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {user.username || user.emailAddress}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {user.emailAddress}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Entreprise
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {user.accounts?.[0]?.companyName || 'Non spécifié'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rôle
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {user.role || 'Utilisateur'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sécurité */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
          </div>
          
          <div className="card-body">
            {!showPasswordForm ? (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-1">Mot de passe</h4>
                  <p className="text-sm text-gray-600">
                    Modifiez votre mot de passe pour sécuriser votre compte
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordForm(true)}
                  icon="Lock"
                >
                  Changer le mot de passe
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  label="Mot de passe actuel"
                  type="password"
                  icon="Lock"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ 
                    ...prev, 
                    currentPassword: e.target.value 
                  }))}
                  required
                />
                
                <Input
                  label="Nouveau mot de passe"
                  type="password"
                  icon="Key"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ 
                    ...prev, 
                    newPassword: e.target.value 
                  }))}
                  required
                  minLength={6}
                />
                
                <Input
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  icon="Key"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ 
                    ...prev, 
                    confirmPassword: e.target.value 
                  }))}
                  required
                  minLength={6}
                />
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetPasswordForm}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="flex-1"
                  >
                    Modifier le mot de passe
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* Informations sur la session */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Informations de session</h3>
          </div>
          
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dernière connexion
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : 'Non disponible'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Statut du compte
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
                    Actif
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MonCompte;