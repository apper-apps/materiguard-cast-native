import { toast } from 'react-toastify';

class EmpruntService {
  constructor() {
    this.tableName = 'emprunt';
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
          { field: { Name: "agent" } },
          { field: { Name: "quantite" } },
          { field: { Name: "date_emprunt" } },
          { field: { Name: "date_retour_prevue" } },
          { field: { Name: "date_retour_effective" } },
          { field: { Name: "status" } },
          { field: { Name: "commentaires" } },
          { 
            field: { name: "article_id" },
            referenceField: { field: { Name: "nom" } }
          }
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
      console.error("Error fetching emprunts:", error);
      toast.error("Erreur lors du chargement des emprunts");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "agent" } },
          { field: { Name: "quantite" } },
          { field: { Name: "date_emprunt" } },
          { field: { Name: "date_retour_prevue" } },
          { field: { Name: "date_retour_effective" } },
          { field: { Name: "status" } },
          { field: { Name: "commentaires" } },
          { 
            field: { name: "article_id" },
            referenceField: { field: { Name: "nom" } }
          }
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
      console.error(`Error fetching emprunt with ID ${id}:`, error);
      toast.error("Erreur lors du chargement de l'emprunt");
      return null;
    }
  }

  async create(empruntData) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        records: [{
          Name: empruntData.Name || `Emprunt ${empruntData.agent}`,
          agent: empruntData.agent,
          quantite: parseInt(empruntData.quantite),
          date_emprunt: empruntData.date_emprunt || new Date().toISOString(),
          date_retour_prevue: empruntData.date_retour_prevue,
          status: empruntData.status || 'En cours',
          commentaires: empruntData.commentaires || "",
          article_id: parseInt(empruntData.article_id || empruntData.articleId)
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
      console.error("Error creating emprunt:", error);
      toast.error("Erreur lors de la création de l'emprunt");
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
      if (updates.agent !== undefined) updateData.agent = updates.agent;
      if (updates.quantite !== undefined) updateData.quantite = parseInt(updates.quantite);
      if (updates.date_emprunt !== undefined) updateData.date_emprunt = updates.date_emprunt;
      if (updates.date_retour_prevue !== undefined) updateData.date_retour_prevue = updates.date_retour_prevue;
      if (updates.date_retour_effective !== undefined) updateData.date_retour_effective = updates.date_retour_effective;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.commentaires !== undefined) updateData.commentaires = updates.commentaires;
      if (updates.article_id !== undefined) updateData.article_id = parseInt(updates.article_id);

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
      console.error("Error updating emprunt:", error);
      toast.error("Erreur lors de la mise à jour de l'emprunt");
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
      console.error("Error deleting emprunts:", error);
      toast.error("Erreur lors de la suppression des emprunts");
      return false;
    }
  }

  async markAsReturned(id, dateRetourEffective = new Date().toISOString()) {
    return this.update(id, {
      status: 'Retourné',
      date_retour_effective: dateRetourEffective
    });
  }
}

export default new EmpruntService();