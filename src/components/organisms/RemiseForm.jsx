import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { generateRemiseQRCode } from "@/utils/qrCodeGenerator";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FilterDropdown from "@/components/molecules/FilterDropdown";
import articleService from "@/services/api/articleService";
import remiseService from "@/services/api/remiseService";

const RemiseForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    agent: '',
    materiel: [null],
    commentaires: '',
    dateRetourPrevue: ''
  });
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [stockItems, setStockItems] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);
useEffect(() => {
    const fetchStockItems = async () => {
      try {
        setLoadingStock(true);
        const articles = await articleService.getAll();
        // Filter to only available items and format for dropdown
const availableItems = articles
.filter(item => item.quantite_disponible > 0)
          .map(item => ({
            value: item.Id,
label: `${item.nom} (Disponible: ${item.quantite_disponible})`,
            item: item
          }));
        setStockItems(availableItems);
      } catch (error) {
        toast.error('Erreur lors du chargement du stock');
        console.error('Error loading stock:', error);
      } finally {
        setLoadingStock(false);
      }
    };

    fetchStockItems();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const handleMaterielChange = (index, selectedOption) => {
    const newMateriel = [...formData.materiel];
    newMateriel[index] = selectedOption;
    setFormData(prev => ({
      ...prev,
      materiel: newMateriel
    }));
  };

const addMaterielField = () => {
    setFormData(prev => ({
      ...prev,
      materiel: [...prev.materiel, null]
    }));
  };

  const removeMaterielField = (index) => {
    if (formData.materiel.length > 1) {
      const newMateriel = formData.materiel.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        materiel: newMateriel
      }));
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agent || formData.materiel.some(m => !m)) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

try {
      setLoading(true);
      
// Convert selected items to material names for storage
      const materielFiltered = formData.materiel
        .filter(m => m && m.item)
        .map(m => m.item.nom);
      
const remiseData = {
        Name: `Remise ${formData.agent}`,
        agent: formData.agent,
        materiel: materielFiltered,
        date_retour_prevue: formData.dateRetourPrevue,
        commentaires: formData.commentaires,
        signature: 'signature_electronique_' + Date.now()
      };

      const newRemise = await remiseService.create(remiseData);
      
      // Générer le QR code
      const qrCodeData = await generateRemiseQRCode(
        newRemise.Id,
        newRemise.agent,
        newRemise.date
      );
      
      setQrCode(qrCodeData);
      toast.success('Remise de matériel créée avec succès');
      
      if (onSuccess) {
        onSuccess(newRemise);
      }
    } catch (err) {
      toast.error('Erreur lors de la création de la remise');
    } finally {
      setLoading(false);
    }
  };

const resetForm = () => {
    setFormData({
      agent: '',
      materiel: [null],
      commentaires: '',
      dateRetourPrevue: ''
    });
    setQrCode(null);
  };

  if (qrCode) {
    return (
      <motion.div
        className="card max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="card-body text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Remise créée avec succès !
          </h3>
<p className="text-gray-600 mb-6">
            Voici le QR code de la remise pour {formData.agent}
          </p>
          
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-6">
            <img src={qrCode} alt="QR Code remise" className="w-48 h-48" />
          </div>
<div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={resetForm}>
              Nouvelle remise
            </Button>
            <Button variant="outline" onClick={() => onSuccess && onSuccess()}>
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Retour à la liste
            </Button>
            <Button variant="primary" onClick={() => window.print()}>
              <ApperIcon name="Printer" className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Nouvelle remise de matériel</h3>
      </div>
      
      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nom de l'agent"
            icon="User"
            value={formData.agent}
            onChange={(e) => handleInputChange('agent', e.target.value)}
            placeholder="Entrez le nom de l'agent"
            required
          />

<div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Matériel remis
            </label>
            {loadingStock ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Chargement du stock...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {formData.materiel.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <FilterDropdown
                          options={stockItems}
                          value={item}
                          onChange={(selectedOption) => handleMaterielChange(index, selectedOption)}
                          placeholder={`Sélectionner l'article ${index + 1}`}
                          icon="Package"
                        />
                      </div>
                      {formData.materiel.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          icon="X"
                          onClick={() => removeMaterielField(index)}
                          className="px-3"
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  icon="Plus"
                  onClick={addMaterielField}
                  className="mt-3"
                  disabled={stockItems.length === 0}
                >
                  Ajouter un article
                </Button>
                
                {stockItems.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Aucun article disponible en stock
                  </p>
                )}
              </>
            )}
          </div>

          <Input
            label="Date de retour prévue"
            type="datetime-local"
            icon="Calendar"
            value={formData.dateRetourPrevue}
            onChange={(e) => handleInputChange('dateRetourPrevue', e.target.value)}
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Commentaires
            </label>
            <textarea
              value={formData.commentaires}
              onChange={(e) => handleInputChange('commentaires', e.target.value)}
              placeholder="Commentaires ou instructions particulières..."
              rows={4}
              className="w-full px-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
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
              Créer la remise
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default RemiseForm;