import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import articleService from '@/services/api/articleService';

const StockTable = ({ onEditArticle }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await articleService.getAll();
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const getStockStatus = (article) => {
    if (article.quantiteDisponible === 0) {
      return { variant: 'danger', label: 'Rupture', icon: 'AlertTriangle' };
    }
    if (article.quantiteDisponible <= article.seuilAlerte) {
      return { variant: 'warning', label: 'Stock faible', icon: 'AlertCircle' };
    }
    return { variant: 'success', label: 'Disponible', icon: 'CheckCircle' };
  };

  const getAvailabilityPercentage = (article) => {
    return Math.round((article.quantiteDisponible / article.quantiteTotal) * 100);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadArticles} />;
  if (articles.length === 0) return <Empty title="Aucun article en stock" description="Commencez par ajouter des articles à votre inventaire" />;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Inventaire des articles</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
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
            {articles.map((article, index) => {
              const status = getStockStatus(article);
              const availability = getAvailabilityPercentage(article);
              
              return (
                <motion.tr
                  key={article.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mr-4">
                        <ApperIcon name="Package" className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{article.nom}</div>
                        <div className="text-sm text-gray-500">{article.marque} {article.modele}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <Badge variant="default">{article.categorie}</Badge>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-900">
                        <span className="font-semibold">{article.quantiteDisponible}</span> / {article.quantiteTotal}
                      </div>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            availability > 50 ? 'bg-green-500' : 
                            availability > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${availability}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">{availability}% disponible</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <Badge variant={status.variant} icon={status.icon}>
                      {status.label}
                    </Badge>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Edit"
                        onClick={() => onEditArticle(article)}
                      >
                        Modifier
                      </Button>
                    </div>
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

export default StockTable;