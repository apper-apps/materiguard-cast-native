import empruntsData from '@/services/mockData/emprunts.json';

class EmpruntService {
  constructor() {
    this.emprunts = [...empruntsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.emprunts];
  }

  async getById(id) {
    await this.delay();
    const emprunt = this.emprunts.find(item => item.Id === parseInt(id));
    if (!emprunt) {
      throw new Error(`Emprunt avec l'ID ${id} introuvable`);
    }
    return { ...emprunt };
  }

  async create(empruntData) {
    await this.delay();
    const newId = Math.max(...this.emprunts.map(e => e.Id)) + 1;
    const newEmprunt = {
      Id: newId,
      ...empruntData,
      dateEmprunt: new Date().toISOString(),
      status: 'En cours'
    };
    this.emprunts.push(newEmprunt);
    return { ...newEmprunt };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.emprunts.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Emprunt avec l'ID ${id} introuvable`);
    }
    this.emprunts[index] = { ...this.emprunts[index], ...updates };
    return { ...this.emprunts[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.emprunts.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Emprunt avec l'ID ${id} introuvable`);
    }
    const deletedEmprunt = this.emprunts.splice(index, 1)[0];
    return { ...deletedEmprunt };
  }

  async getByAgent(agent) {
    await this.delay();
    return this.emprunts.filter(emprunt => 
      emprunt.agent.toLowerCase().includes(agent.toLowerCase())
    );
  }

  async getByArticle(articleId) {
    await this.delay();
    return this.emprunts.filter(emprunt => emprunt.articleId === parseInt(articleId));
  }

  async getByStatus(status) {
    await this.delay();
    return this.emprunts.filter(emprunt => emprunt.status === status);
  }

  async getOverdue() {
    await this.delay();
    const now = new Date();
    return this.emprunts.filter(emprunt => 
      emprunt.status === 'En cours' && 
      new Date(emprunt.dateRetourPrevue) < now
    ).map(emprunt => ({ ...emprunt, status: 'En retard' }));
  }

  async markAsReturned(id, dateRetourEffective = new Date().toISOString()) {
    await this.delay();
    const index = this.emprunts.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Emprunt avec l'ID ${id} introuvable`);
    }
    
    this.emprunts[index] = {
      ...this.emprunts[index],
      status: 'Retourné',
      dateRetourEffective
    };
    
    return { ...this.emprunts[index] };
  }
}

export default new EmpruntService();