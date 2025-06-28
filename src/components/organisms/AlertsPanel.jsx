import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import articleService from '@/services/api/articleService';
import empruntService from '@/services/api/empruntService';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [lowStockArticles, overdueEmprunts] = await Promise.all([
        articleService.getLowStock(),
        empruntService.getOverdue()
      ]);

      const alertsData = [
        ...lowStockArticles.map(article => ({
          id: `stock-${article.Id}`,
          type: 'stock',
          title: 'Stock faible',
          message: `${article.nom} - ${article.quantiteDisponible} restants`,
          severity: article.quantiteDisponible === 0 ? 'danger' : 'warning',
          icon: article.quantiteDisponible === 0 ? 'XCircle' : 'AlertTriangle',
          timestamp: new Date()
        })),
        ...overdueEmprunts.map(emprunt => ({
          id: `overdue-${emprunt.Id}`,
          type: 'overdue',
          title: 'Emprunt en retard',
          message: `${emprunt.agent} - Retour prévu le ${new Date(emprunt.dateRetourPrevue).toLocaleDateString()}`,
          severity: 'danger',
          icon: 'Clock',
          timestamp: new Date(emprunt.dateRetourPrevue)
        }))
      ];

      // Trier par sévérité puis par timestamp
      alertsData.sort((a, b) => {
        if (a.severity === 'danger' && b.severity !== 'danger') return -1;
        if (a.severity !== 'danger' && b.severity === 'danger') return 1;
        return b.timestamp - a.timestamp;
      });

      setAlerts(alertsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAlerts} />;

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Alertes</h3>
          <Badge variant={alerts.length > 0 ? 'danger' : 'success'}>
            {alerts.length} alerte{alerts.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>
      
      <div className="card-body">
        {alerts.length === 0 ? (
          <Empty 
            title="Aucune alerte" 
            description="Tout va bien ! Aucune alerte nécessitant votre attention."
            icon="CheckCircle"
          />
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'danger' 
                    ? 'bg-red-50 border-red-500' 
                    : 'bg-yellow-50 border-yellow-500'
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    alert.severity === 'danger' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    <ApperIcon name={alert.icon} className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;