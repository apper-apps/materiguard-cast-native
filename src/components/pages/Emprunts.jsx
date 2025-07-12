import { useState } from 'react';
import { useAuth } from '@/App';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import EmpruntTable from '@/components/organisms/EmpruntTable';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import articleService from '@/services/api/articleService';
import empruntService from '@/services/api/empruntService';
const Emprunts = () => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({
    agent: '',
    articleId: '',
    quantite: '1',
    dateRetourPrevue: '',
    commentaires: ''
  });

  const loadArticles = async () => {
    try {
      const data = await articleService.getAll();
      setArticles(data.filter(a => a.quantiteDisponible > 0));
    } catch (err) {
      toast.error('Erreur lors du chargement des articles');
    }
  };

  const resetForm = () => {
    setFormData({
      agent: '',
      articleId: '',
      quantite: '1',
      dateRetourPrevue: '',
      commentaires: ''
    });
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const empruntData = {
        ...formData,
        articleId: parseInt(formData.articleId),
        quantite: parseInt(formData.quantite)
      };

      // Vérifier le stock disponible
      const article = articles.find(a => a.Id === empruntData.articleId);
      if (!article || article.quantiteDisponible < empruntData.quantite) {
        toast.error('Stock insuffisant pour cet article');
        return;
      }

      // Créer l'emprunt
      await empruntService.create(empruntData);
      
      // Mettre à jour le stock
      await articleService.updateStock(empruntData.articleId, -empruntData.quantite);
      
      toast.success('Emprunt enregistré avec succès');
      resetForm();
      window.location.reload();
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement de l\'emprunt');
    }
  };

  const handleShowForm = () => {
    setShowAddForm(true);
    loadArticles();
  };

  const articleOptions = articles.map(article => ({
    value: article.Id,
    label: `${article.nom} (${article.quantiteDisponible} disponibles)`
  }));

const headerActions = [];
  
  if (user.role === 'Administrator' || user.role === 'Manager') {
    headerActions.push({
      label: 'Nouvel emprunt',
      icon: 'Plus',
      onClick: handleShowForm,
      variant: 'primary'
    });
  }

  return (
    <div className="h-full">
      <Header 
        title="Gestion des emprunts"
        subtitle="Suivez les emprunts d'équipements par les agents"
        actions={headerActions}
      />
      
      <div className="p-6 space-y-6">
{showAddForm && (user.role === 'Administrator' || user.role === 'Manager') && (
          <motion.div
            className="card max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Nouvel emprunt</h3>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nom de l'agent"
                  icon="User"
                  value={formData.agent}
                  onChange={(e) => setFormData(prev => ({ ...prev, agent: e.target.value }))}
                  required
                />
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Article à emprunter
                  </label>
                  <FilterDropdown
                    options={articleOptions}
                    value={formData.articleId}
                    onChange={(value) => setFormData(prev => ({ ...prev, articleId: value }))}
                    placeholder="Sélectionner un article"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Quantité"
                    type="number"
                    min="1"
                    value={formData.quantite}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantite: e.target.value }))}
                    required
                  />
                  
                  <Input
                    label="Date de retour prévue"
                    type="date"
                    value={formData.dateRetourPrevue}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateRetourPrevue: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Commentaires
                  </label>
                  <textarea
                    value={formData.commentaires}
                    onChange={(e) => setFormData(prev => ({ ...prev, commentaires: e.target.value }))}
                    placeholder="Informations supplémentaires..."
                    rows={3}
                    className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    Enregistrer l'emprunt
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showAddForm ? 0.2 : 0 }}
        >
          <EmpruntTable />
        </motion.div>
      </div>
    </div>
  );
};

export default Emprunts;