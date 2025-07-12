import { useState } from 'react';
import { useAuth } from '@/App';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import StockTable from '@/components/organisms/StockTable';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import articleService from '@/services/api/articleService';
import exportService from '@/services/api/exportService';
const Stock = () => {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    categorie: '',
    quantiteTotal: '',
    seuilAlerte: '',
    marque: '',
    modele: '',
    prixUnitaire: ''
  });

  const categories = [
    { value: 'Communication', label: 'Communication' },
    { value: 'Protection', label: 'Protection' },
    { value: 'Vêtement', label: 'Vêtement' },
    { value: 'Chaussures', label: 'Chaussures' },
    { value: 'Éclairage', label: 'Éclairage' },
    { value: 'Sécurité', label: 'Sécurité' },
    { value: 'Identification', label: 'Identification' },
    { value: 'Défense', label: 'Défense' }
  ];

  const resetForm = () => {
    setFormData({
      nom: '',
      categorie: '',
      quantiteTotal: '',
      seuilAlerte: '',
      marque: '',
      modele: '',
      prixUnitaire: ''
    });
    setShowAddForm(false);
    setEditingArticle(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const articleData = {
        ...formData,
        quantiteTotal: parseInt(formData.quantiteTotal),
        seuilAlerte: parseInt(formData.seuilAlerte),
        prixUnitaire: parseFloat(formData.prixUnitaire)
      };

      if (editingArticle) {
        await articleService.update(editingArticle.Id, articleData);
        toast.success('Article modifié avec succès');
      } else {
        await articleService.create(articleData);
        toast.success('Article ajouté avec succès');
      }
      
      resetForm();
      window.location.reload(); // Refresh to show updated data
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      nom: article.nom,
      categorie: article.categorie,
      quantiteTotal: article.quantiteTotal.toString(),
      seuilAlerte: article.seuilAlerte.toString(),
      marque: article.marque || '',
      modele: article.modele || '',
      prixUnitaire: article.prixUnitaire?.toString() || ''
    });
    setShowAddForm(true);
};

  const handleExportExcel = async () => {
    try {
      toast.info('Export Excel en cours...');
      const result = await exportService.exportToExcel();
      toast.success(`Export Excel réussi: ${result.filename}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleExportPDF = async () => {
    try {
      toast.info('Export PDF en cours...');
      const result = await exportService.exportToPDF();
      toast.success(`Export PDF réussi: ${result.filename}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

const headerActions = [];
  
  if (user.role === 'Administrator' || user.role === 'Manager') {
    headerActions.push(
      {
        label: 'Export Excel',
        icon: 'FileSpreadsheet',
        onClick: handleExportExcel,
        variant: 'outline'
      },
      {
        label: 'Export PDF',
        icon: 'FileText',
        onClick: handleExportPDF,
        variant: 'outline'
      }
    );
  }
  
  if (user.role === 'Administrator') {
    headerActions.push({
      label: 'Ajouter un article',
      icon: 'Plus',
      onClick: () => setShowAddForm(true),
      variant: 'primary'
    });
  }
  return (
    <div className="h-full">
      <Header 
        title="Gestion du stock"
        subtitle="Gérez votre inventaire d'équipements de sécurité"
        actions={headerActions}
      />
      
      <div className="p-6 space-y-6">
{showAddForm && user.role === 'Administrator' && (
          <motion.div
            className="card max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingArticle ? 'Modifier l\'article' : 'Nouvel article'}
              </h3>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nom de l'article"
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <FilterDropdown
                      options={categories}
                      value={formData.categorie}
                      onChange={(value) => setFormData(prev => ({ ...prev, categorie: value }))}
                      placeholder="Sélectionner une catégorie"
                    />
                  </div>
                  
                  <Input
                    label="Quantité totale"
                    type="number"
                    value={formData.quantiteTotal}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantiteTotal: e.target.value }))}
                    required
                  />
                  
                  <Input
                    label="Seuil d'alerte"
                    type="number"
                    value={formData.seuilAlerte}
                    onChange={(e) => setFormData(prev => ({ ...prev, seuilAlerte: e.target.value }))}
                    required
                  />
                  
                  <Input
                    label="Marque"
                    value={formData.marque}
                    onChange={(e) => setFormData(prev => ({ ...prev, marque: e.target.value }))}
                  />
                  
                  <Input
                    label="Modèle"
                    value={formData.modele}
                    onChange={(e) => setFormData(prev => ({ ...prev, modele: e.target.value }))}
                  />
                </div>
                
                <Input
                  label="Prix unitaire (€)"
                  type="number"
                  step="0.01"
                  value={formData.prixUnitaire}
                  onChange={(e) => setFormData(prev => ({ ...prev, prixUnitaire: e.target.value }))}
                />
                
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Annuler
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    {editingArticle ? 'Modifier' : 'Ajouter'}
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
          <StockTable onEditArticle={handleEdit} />
        </motion.div>
      </div>
    </div>
  );
};

export default Stock;