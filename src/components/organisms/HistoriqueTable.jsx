import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import FilterDropdown from '@/components/molecules/FilterDropdown';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import remiseService from '@/services/api/remiseService';

const HistoriqueTable = () => {
  const [remises, setRemises] = useState([]);
  const [filteredRemises, setFilteredRemises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'Actif', label: 'Actif' },
    { value: 'Retourné', label: 'Retourné' },
    { value: 'En retard', label: 'En retard' }
  ];

  const loadRemises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await remiseService.getAll();
      setRemises(data);
      setFilteredRemises(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRemises();
  }, []);

  useEffect(() => {
    let filtered = remises;

// Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(remise => {
        const materielArray = Array.isArray(remise.materiel) ? remise.materiel : (remise.materiel ? remise.materiel.split(',') : []);
        return remise.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
          materielArray.some(m => m.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (remise.qr_code || '').toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
// Filtrer par statut
    if (statusFilter) {
      filtered = filtered.filter(remise => {
        if (statusFilter === 'En retard') {
          return remise.status === 'Actif' && new Date(remise.date_retour_prevue) < new Date();
        }
        return remise.status === statusFilter;
      });
    }

    setFilteredRemises(filtered);
  }, [remises, searchTerm, statusFilter]);

const getStatusBadge = (remise) => {
    const now = new Date();
    const dateRetour = new Date(remise.date_retour_prevue);
    
    if (remise.status === 'Retourné') {
      return { variant: 'success', label: 'Retourné', icon: 'CheckCircle' };
    }
    
    if (dateRetour < now && remise.status === 'Actif') {
      return { variant: 'danger', label: 'En retard', icon: 'AlertTriangle' };
    }
    
    return { variant: 'info', label: 'Actif', icon: 'Clock' };
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadRemises} />;

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchBar
              onSearch={setSearchTerm}
              placeholder="Rechercher par agent, matériel ou QR code..."
              showButton={false}
            />
            <FilterDropdown
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Filtrer par statut"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Historique des remises ({filteredRemises.length})
          </h3>
        </div>
        
        {filteredRemises.length === 0 ? (
          <Empty 
            title="Aucune remise trouvée" 
            description="Aucune remise ne correspond à vos critères de recherche"
            icon="Search"
          />
        ) : (
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
                    Date remise
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date retour prévue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Code
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRemises.map((remise, index) => {
                  const status = getStatusBadge(remise);
                  
                  return (
                    <motion.tr
                      key={remise.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
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
                          {(() => {
                            const materielArray = Array.isArray(remise.materiel) ? remise.materiel : (remise.materiel ? remise.materiel.split(',') : []);
                            const displayMateriel = materielArray.slice(0, 2).join(', ');
                            return (
                              <>
                                {displayMateriel}
                                {materielArray.length > 2 && (
                                  <span className="text-gray-500">
                                    {' '}+{materielArray.length - 2} autre{materielArray.length > 3 ? 's' : ''}
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {format(new Date(remise.date), 'dd MMM yyyy HH:mm', { locale: fr })}
                        </div>
                      </td>
<td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {remise.date_retour_prevue ? 
                            format(new Date(remise.date_retour_prevue), 'dd MMM yyyy', { locale: fr }) :
                            'Non définie'
                          }
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <Badge variant={status.variant} icon={status.icon}>
                          {status.label}
                        </Badge>
                      </td>
                      
<td className="px-6 py-4">
                        <div className="flex items-center">
                          <code className="px-2 py-1 text-xs bg-gray-100 rounded text-gray-800">
                            {remise.qr_code}
                          </code>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoriqueTable;