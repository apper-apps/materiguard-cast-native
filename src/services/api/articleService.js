import articlesData from '@/services/mockData/articles.json';

class ArticleService {
  constructor() {
    this.articles = [...articlesData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.articles];
  }

  async getById(id) {
    await this.delay();
    const article = this.articles.find(item => item.Id === parseInt(id));
    if (!article) {
      throw new Error(`Article avec l'ID ${id} introuvable`);
    }
    return { ...article };
  }

  async create(articleData) {
    await this.delay();
    const newId = Math.max(...this.articles.map(a => a.Id)) + 1;
    const newArticle = {
      Id: newId,
      ...articleData,
      quantiteDisponible: articleData.quantiteTotal
    };
    this.articles.push(newArticle);
    return { ...newArticle };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.articles.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Article avec l'ID ${id} introuvable`);
    }
    this.articles[index] = { ...this.articles[index], ...updates };
    return { ...this.articles[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.articles.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Article avec l'ID ${id} introuvable`);
    }
    const deletedArticle = this.articles.splice(index, 1)[0];
    return { ...deletedArticle };
  }

  async getByCategory(category) {
    await this.delay();
    return this.articles.filter(article => article.categorie === category);
  }

  async getLowStock() {
    await this.delay();
    return this.articles.filter(article => article.quantiteDisponible <= article.seuilAlerte);
  }

  async updateStock(id, quantityChange) {
    await this.delay();
    const index = this.articles.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Article avec l'ID ${id} introuvable`);
    }
    
    const article = this.articles[index];
    const newQuantity = article.quantiteDisponible + quantityChange;
    
    if (newQuantity < 0) {
      throw new Error('Stock insuffisant');
    }
    
    if (newQuantity > article.quantiteTotal) {
      throw new Error('Quantité disponible ne peut pas dépasser le stock total');
    }
    
    this.articles[index] = {
      ...article,
      quantiteDisponible: newQuantity
    };
    
    return { ...this.articles[index] };
  }
}

export default new ArticleService();