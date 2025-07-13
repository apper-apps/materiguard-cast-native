import { toast } from 'react-toastify';

class StockService {
  constructor() {
    this.tableName = 'stock';
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
          { field: { Name: "quantity" } },
          { 
            field: { name: "article" },
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
      console.error("Error fetching stock:", error);
      toast.error("Erreur lors du chargement du stock");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "quantity" } },
          { 
            field: { name: "article" },
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
      console.error(`Error fetching stock with ID ${id}:`, error);
      toast.error("Erreur lors du chargement du stock");
      return null;
    }
  }

  async create(stockData) {
    try {
      const apperClient = this.getApperClient();
      const params = {
        records: [{
          Name: stockData.Name || `Stock ${stockData.article}`,
          quantity: parseInt(stockData.quantity),
          article: parseInt(stockData.article)
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
      console.error("Error creating stock:", error);
      toast.error("Erreur lors de la création du stock");
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
      if (updates.quantity !== undefined) updateData.quantity = parseInt(updates.quantity);
      if (updates.article !== undefined) updateData.article = parseInt(updates.article);

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
      console.error("Error updating stock:", error);
      toast.error("Erreur lors de la mise à jour du stock");
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
      console.error("Error deleting stock:", error);
      toast.error("Erreur lors de la suppression du stock");
      return false;
    }
  }
}

export default new StockService();