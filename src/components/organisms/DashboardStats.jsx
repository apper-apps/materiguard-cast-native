import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import articleService from '@/services/api/articleService';
import empruntService from '@/services/api/empruntService';
import remiseService from '@/services/api/remiseService';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    articlesDisponibles: 0,
    empruntsActifs: 0,
    empruntsEnRetard: 0,
    remisesActives: 0,
    articlesStockFaible: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [articles, emprunts, remises] = await Promise.all([
        articleService.getAll(),
        empruntService.getAll(),
        remiseService.getAll()
      ]);

      const now = new Date();
      
      const empruntsActifs = emprunts.filter(e => e.status === 'En cours');
      const empruntsEnRetard = emprunts.filter(e => 
e.status === 'En cours' && new Date(e.date_retour_prevue) < now
      );
      const remisesActives = remises.filter(r => r.status === 'Actif');
const articlesStockFaible = articles.filter(a => 
        a.quantite_disponible <= a.seuil_alerte
      );
      const articlesDisponibles = articles.reduce((sum, article) => 
        sum + article.quantite_disponible, 0
      );

      setStats({
        totalArticles: articles.length,
        articlesDisponibles,
        empruntsActifs: empruntsActifs.length,
        empruntsEnRetard: empruntsEnRetard.length,
        remisesActives: remisesActives.length,
        articlesStockFaible: articlesStockFaible.length
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadStats} />;

  const statCards = [
    {
      title: 'Articles en stock',
      value: stats.totalArticles,
      icon: 'Package',
      trend: 85
    },
    {
      title: 'Disponibles',
      value: stats.articlesDisponibles,
      icon: 'CheckCircle',
      change: '+12 cette semaine',
      changeType: 'positive',
      trend: 92
    },
    {
      title: 'Emprunts actifs',
      value: stats.empruntsActifs,
      icon: 'Calendar',
      change: stats.empruntsEnRetard > 0 ? `${stats.empruntsEnRetard} en retard` : 'Tous à jour',
      changeType: stats.empruntsEnRetard > 0 ? 'negative' : 'positive',
      trend: 78
    },
    {
      title: 'Stock faible',
      value: stats.articlesStockFaible,
      icon: 'AlertTriangle',
      change: stats.articlesStockFaible > 0 ? 'Action requise' : 'Stocks normaux',
      changeType: stats.articlesStockFaible > 0 ? 'negative' : 'positive',
      trend: stats.articlesStockFaible > 0 ? 25 : 95
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;