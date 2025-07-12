import { toast } from 'react-toastify';

class ArticleService {
  constructor() {
    this.tableName = 'article';
  }

  getApperClient() {
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "nom" } },
          { field: { Name: "categorie" } },
          { field: { Name: "quantite_total" } },
          { field: { Name: "quantite_disponible" } },
          { field: { Name: "seuil_alerte" } },
          { field: { Name: "image" } },
          { field: { Name: "description" } },
          { field: { Name: "marque" } },
          { field: { Name: "modele" } },
          { field: { Name: "prix_unitaire" } }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Erreur lors du chargement des articles");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "nom" } },
          { field: { Name: "categorie" } },
          { field: { Name: "quantite_total" } },
          { field: { Name: "quantite_disponible" } },
          { field: { Name: "seuil_alerte" } },
          { field: { Name: "image" } },
          { field: { Name: "description" } },
          { field: { Name: "marque" } },
          { field: { Name: "modele" } },
          { field: { Name: "prix_unitaire" } }
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching article with ID ${id}:`, error);
      toast.error("Erreur lors du chargement de l'article");
      return null;
    }
  }

  async create(articleData) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        records: [{
          Name: articleData.Name || articleData.nom,
          nom: articleData.nom,
          categorie: articleData.categorie,
          quantite_total: parseInt(articleData.quantite_total || articleData.quantiteTotal),
          quantite_disponible: parseInt(articleData.quantite_disponible || articleData.quantiteTotal),
          seuil_alerte: parseInt(articleData.seuil_alerte || articleData.seuilAlerte),
          image: articleData.image || "",
          description: articleData.description || "",
          marque: articleData.marque || "",
          modele: articleData.modele || "",
          prix_unitaire: parseFloat(articleData.prix_unitaire || articleData.prixUnitaire || 0)
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Erreur lors de la création de l'article");
      return null;
    }
  }

  async update(id, updates) {
    try {
      const apperClient = this.getApperClient();
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (updates.Name !== undefined) updateData.Name = updates.Name;
      if (updates.nom !== undefined) updateData.nom = updates.nom;
      if (updates.categorie !== undefined) updateData.categorie = updates.categorie;
      if (updates.quantite_total !== undefined) updateData.quantite_total = parseInt(updates.quantite_total);
      if (updates.quantite_disponible !== undefined) updateData.quantite_disponible = parseInt(updates.quantite_disponible);
      if (updates.seuil_alerte !== undefined) updateData.seuil_alerte = parseInt(updates.seuil_alerte);
      if (updates.image !== undefined) updateData.image = updates.image;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.marque !== undefined) updateData.marque = updates.marque;
      if (updates.modele !== undefined) updateData.modele = updates.modele;
      if (updates.prix_unitaire !== undefined) updateData.prix_unitaire = parseFloat(updates.prix_unitaire);

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("Erreur lors de la mise à jour de l'article");
      return null;
    }
  }

  async delete(recordIds) {
    try {
      const apperClient = this.getApperClient();
      const ids = Array.isArray(recordIds) ? recordIds : [recordIds];
      
      const params = {
        RecordIds: ids.map(id => parseInt(id))
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length === ids.length;
      }
    } catch (error) {
      console.error("Error deleting articles:", error);
      toast.error("Erreur lors de la suppression des articles");
      return false;
    }
  }
}

export default new ArticleService();