import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import empruntService from '@/services/api/empruntService';
import articleService from '@/services/api/articleService';

const EmpruntTable = () => {
  const [emprunts, setEmprunts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [empruntsData, articlesData] = await Promise.all([
        empruntService.getAll(),
        articleService.getAll()
      ]);
      setEmprunts(empruntsData);
      setArticles(articlesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getArticleName = (articleId) => {
    const article = articles.find(a => a.Id === articleId);
    return article ? article.nom : 'Article inconnu';
  };

  const getStatusBadge = (emprunt) => {
    const now = new Date();
    const dateRetour = new Date(emprunt.dateRetourPrevue);
    
    if (emprunt.status === 'Retourné') {
      return { variant: 'success', label: 'Retourné', icon: 'CheckCircle' };
    }
    
    if (dateRetour < now && emprunt.status === 'En cours') {
      return { variant: 'danger', label: 'En retard', icon: 'AlertTriangle' };
    }
    
    return { variant: 'info', label: 'En cours', icon: 'Clock' };
  };

  const handleReturn = async (empruntId) => {
    try {
      await empruntService.markAsReturned(empruntId);
      
      // Mettre à jour le stock
      const emprunt = emprunts.find(e => e.Id === empruntId);
      if (emprunt) {
        await articleService.updateStock(emprunt.articleId, emprunt.quantite);
      }
      
      toast.success('Retour enregistré avec succès');
      loadData();
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement du retour');
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (emprunts.length === 0) return <Empty title="Aucun emprunt" description="Aucun emprunt d'équipement n'a été enregistré" />;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Emprunts en cours</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantité
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date retour prévue
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {emprunts.map((emprunt, index) => {
              const status = getStatusBadge(emprunt);
              
              return (
                <motion.tr
                  key={emprunt.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mr-3">
                        <ApperIcon name="User" className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{emprunt.agent}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{getArticleName(emprunt.articleId)}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{emprunt.quantite}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {format(new Date(emprunt.dateRetourPrevue), 'dd MMM yyyy', { locale: fr })}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <Badge variant={status.variant} icon={status.icon}>
                      {status.label}
                    </Badge>
                  </td>
                  
                  <td className="px-6 py-4">
                    {emprunt.status !== 'Retourné' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="CheckCircle"
                        onClick={() => handleReturn(emprunt.Id)}
                      >
                        Marquer retourné
                      </Button>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmpruntTable;