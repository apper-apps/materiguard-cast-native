import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    await login(formData.username, formData.password);
    
    setIsLoading(false);
  };

  const predefinedUsers = [
    { username: 'admin', password: 'admin123', role: 'Administrator' },
    { username: 'manager', password: 'manager123', role: 'Manager' },
    { username: 'user', password: 'user123', role: 'User' }
  ];

  const handlePredefinedLogin = (userInfo) => {
    setFormData({
      username: userInfo.username,
      password: userInfo.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <ApperIcon name="Shield" className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">MatériGuard Pro</h1>
          <p className="text-white/80">Système de gestion sécurisé</p>
        </div>

        {/* Login Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Connexion</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nom d'utilisateur"
              icon="User"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              required
              disabled={isLoading}
            />
            
            <Input
              label="Mot de passe"
              type="password"
              icon="Lock"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Connexion...</span>
                </div>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">Comptes de démonstration</p>
            <div className="space-y-2">
              {predefinedUsers.map((userInfo) => (
                <button
                  key={userInfo.username}
                  onClick={() => handlePredefinedLogin(userInfo)}
                  disabled={isLoading}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{userInfo.username}</div>
                      <div className="text-sm text-gray-600">Mot de passe: {userInfo.password}</div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      userInfo.role === 'Administrator' ? 'bg-purple-100 text-purple-800' :
                      userInfo.role === 'Manager' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {userInfo.role}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-8 text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="Info" className="w-4 h-4" />
            <span>Version 1.0.0 - Gestion sécurisée du matériel</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;