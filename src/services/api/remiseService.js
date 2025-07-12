import { toast } from 'react-toastify';

class RemiseService {
  constructor() {
    this.tableName = 'remise';
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
          { field: { Name: "materiel" } },
          { field: { Name: "date" } },
          { field: { Name: "signature" } },
          { field: { Name: "qr_code" } },
          { field: { Name: "status" } },
          { field: { Name: "date_retour_prevue" } },
          { field: { Name: "date_retour_effective" } },
          { field: { Name: "commentaires" } }
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
      console.error("Error fetching remises:", error);
      toast.error("Erreur lors du chargement des remises");
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
          { field: { Name: "materiel" } },
          { field: { Name: "date" } },
          { field: { Name: "signature" } },
          { field: { Name: "qr_code" } },
          { field: { Name: "status" } },
          { field: { Name: "date_retour_prevue" } },
          { field: { Name: "date_retour_effective" } },
          { field: { Name: "commentaires" } }
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
      console.error(`Error fetching remise with ID ${id}:`, error);
      toast.error("Erreur lors du chargement de la remise");
      return null;
    }
  }

  async create(remiseData) {
    try {
      const apperClient = this.getApperClient();
      
      // Generate QR code
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const qrCode = `MGT-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${timestamp}`;
      
      const params = {
        records: [{
          Name: remiseData.Name || `Remise ${remiseData.agent}`,
          agent: remiseData.agent,
          materiel: Array.isArray(remiseData.materiel) ? remiseData.materiel.join(',') : remiseData.materiel,
          date: remiseData.date || new Date().toISOString(),
          signature: remiseData.signature || "",
          qr_code: qrCode,
          status: remiseData.status || 'Actif',
          date_retour_prevue: remiseData.date_retour_prevue || remiseData.dateRetourPrevue,
          commentaires: remiseData.commentaires || ""
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
      console.error("Error creating remise:", error);
      toast.error("Erreur lors de la création de la remise");
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
      if (updates.materiel !== undefined) {
        updateData.materiel = Array.isArray(updates.materiel) ? updates.materiel.join(',') : updates.materiel;
      }
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.signature !== undefined) updateData.signature = updates.signature;
      if (updates.qr_code !== undefined) updateData.qr_code = updates.qr_code;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.date_retour_prevue !== undefined) updateData.date_retour_prevue = updates.date_retour_prevue;
      if (updates.date_retour_effective !== undefined) updateData.date_retour_effective = updates.date_retour_effective;
      if (updates.commentaires !== undefined) updateData.commentaires = updates.commentaires;

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
      console.error("Error updating remise:", error);
      toast.error("Erreur lors de la mise à jour de la remise");
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
      console.error("Error deleting remises:", error);
      toast.error("Erreur lors de la suppression des remises");
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

export default new RemiseService();