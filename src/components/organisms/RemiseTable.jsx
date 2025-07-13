import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import remiseService from "@/services/api/remiseService";

const RemiseTable = ({ onEditRemise }) => {
  const [remises, setRemises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRemises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await remiseService.getAll();
      setRemises(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRemises();
  }, []);

  const getStatusBadge = (remise) => {
    switch (remise.status) {
      case 'Actif':
        return { variant: 'info', label: 'Actif', icon: 'Clock' };
      case 'Retourné':
        return { variant: 'success', label: 'Retourné', icon: 'CheckCircle' };
      case 'En retard':
        return { variant: 'danger', label: 'En retard', icon: 'AlertTriangle' };
      default:
        return { variant: 'default', label: remise.status || 'Inconnu', icon: 'Info' };
    }
  };

  const handleDelete = async (remiseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette remise ? Cette action est irréversible.')) {
      try {
        await remiseService.delete(remiseId);
        toast.success('Remise supprimée avec succès');
        loadRemises();
      } catch (err) {
        toast.error('Erreur lors de la suppression de la remise');
      }
    }
  };

  const handleView = (remise) => {
    // Implementation for viewing remise details
    toast.info(`Affichage des détails de la remise pour ${remise.agent}`);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadRemises} />;
  if (remises.length === 0) return <Empty title="Aucune remise" description="Aucune remise de matériel n'a été enregistrée" />;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Historique des remises</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matériel
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
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
            {remises.map((remise, index) => {
              const status = getStatusBadge(remise);
              
              return (
                <motion.tr
                  key={remise.Id}
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
                      <div className="text-sm font-medium text-gray-900">{remise.agent}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {Array.isArray(remise.materiel) 
                        ? remise.materiel.join(', ')
                        : typeof remise.materiel === 'string' 
                          ? remise.materiel.split(',').join(', ')
                          : remise.materiel || 'Non spécifié'
                      }
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {remise.date ? format(new Date(remise.date), 'dd MMM yyyy', { locale: fr }) : 'Non spécifié'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {remise.date_retour_prevue 
                        ? format(new Date(remise.date_retour_prevue), 'dd MMM yyyy', { locale: fr })
                        : 'Non spécifié'
                      }
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
                        icon="Eye"
                        onClick={() => handleView(remise)}
                      >
                        Voir
                      </Button>
                      
                      {onEditRemise && (
                        <Button
                          variant="outline"
                          size="sm"
                          icon="Edit"
                          onClick={() => onEditRemise(remise)}
                        >
                          Modifier
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Trash2"
                        onClick={() => handleDelete(remise.Id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Supprimer
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

export default RemiseTable;