import Header from '@/components/organisms/Header';
import HistoriqueTable from '@/components/organisms/HistoriqueTable';

const Historique = () => {
  return (
    <div className="h-full">
      <Header 
        title="Historique des remises"
        subtitle="Consultez l'historique complet de toutes les remises de matériel"
      />
      
      <div className="p-6">
        <HistoriqueTable />
      </div>
    </div>
  );
};

export default Historique;