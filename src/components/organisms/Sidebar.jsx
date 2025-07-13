import { NavLink } from 'react-router-dom';
import { useAuth } from '@/App';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
const Sidebar = () => {
  const { user } = useAuth();
const allNavItems = [
{ path: '/', icon: 'LayoutDashboard', label: 'Dashboard', roles: ['Administrator', 'Manager', 'User'] },
    { path: '/remises', icon: 'FileText', label: 'Remises', roles: ['Administrator', 'Manager', 'User'] },
    { path: '/stock', icon: 'Package', label: 'Stock', roles: ['Administrator', 'Manager', 'User'] },
    { path: '/emprunts', icon: 'Calendar', label: 'Emprunts', roles: ['Administrator', 'Manager', 'User'] },
    { path: '/historique', icon: 'History', label: 'Historique', roles: ['Administrator', 'Manager', 'User'] },
    { path: '/mon-compte', icon: 'User', label: 'Mon Compte', roles: ['Administrator', 'Manager', 'User'] }
];

  const navItems = user?.role ? allNavItems.filter(item => item.roles.includes(user.role)) : allNavItems;
  return (
    <motion.div
      className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Shield" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">MatériGuard</h2>
            <p className="text-sm text-gray-600">Pro</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <ApperIcon name="Info" className="w-4 h-4" />
          <span>Version 1.0.0</span>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;