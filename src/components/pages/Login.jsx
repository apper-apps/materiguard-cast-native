import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useContext } from 'react';
import { AuthContext } from '../../App';
import ApperIcon from '@/components/ApperIcon';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isInitialized } = useContext(AuthContext);
  
  useEffect(() => {
    if (isInitialized) {
      // Show login UI in this component
      const { ApperUI } = window.ApperSDK;
      ApperUI.showLogin("#authentication");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary via-accent to-primary p-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-2xl">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center bg-gradient-to-r from-primary to-accent text-white text-2xl 2xl:text-3xl font-bold">
            M
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-lg xl:text-xl font-bold">
              Se connecter à MatériGuard Pro
            </div>
            <div className="text-center text-sm text-gray-500">
              Bienvenue, veuillez vous connecter pour continuer
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
              S'inscrire
            </Link>
          </p>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <div className="flex items-center justify-center space-x-2">
            <ApperIcon name="Info" className="w-4 h-4" />
            <span>Version 1.0.0 - Gestion sécurisée du matériel</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;