import remisesData from '@/services/mockData/remises.json';

class RemiseService {
  constructor() {
    this.remises = [...remisesData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.remises];
  }

  async getById(id) {
    await this.delay();
    const remise = this.remises.find(item => item.Id === parseInt(id));
    if (!remise) {
      throw new Error(`Remise avec l'ID ${id} introuvable`);
    }
    return { ...remise };
  }

  async create(remiseData) {
    await this.delay();
    const newId = Math.max(...this.remises.map(r => r.Id)) + 1;
    const qrCode = `MGT-${String(newId).padStart(3, '0')}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`;
    
    const newRemise = {
      Id: newId,
      ...remiseData,
      date: new Date().toISOString(),
      qrCode,
      status: 'Actif'
    };
    
    this.remises.push(newRemise);
    return { ...newRemise };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.remises.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Remise avec l'ID ${id} introuvable`);
    }
    this.remises[index] = { ...this.remises[index], ...updates };
    return { ...this.remises[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.remises.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Remise avec l'ID ${id} introuvable`);
    }
    const deletedRemise = this.remises.splice(index, 1)[0];
    return { ...deletedRemise };
  }

  async getByAgent(agent) {
    await this.delay();
    return this.remises.filter(remise => 
      remise.agent.toLowerCase().includes(agent.toLowerCase())
    );
  }

  async getByStatus(status) {
    await this.delay();
    return this.remises.filter(remise => remise.status === status);
  }

  async getOverdue() {
    await this.delay();
    const now = new Date();
    return this.remises.filter(remise => 
      remise.status === 'Actif' && 
      new Date(remise.dateRetourPrevue) < now
    );
  }

  async markAsReturned(id, dateRetourEffective = new Date().toISOString()) {
    await this.delay();
    const index = this.remises.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Remise avec l'ID ${id} introuvable`);
    }
    
    this.remises[index] = {
      ...this.remises[index],
      status: 'Retourné',
      dateRetourEffective
    };
    
    return { ...this.remises[index] };
  }
}

export default new RemiseService();