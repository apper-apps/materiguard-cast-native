import usersData from '@/services/mockData/users.json';
import CryptoJS from 'crypto-js';

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }

  async getAll() {
    await this.delay();
    return this.users.map(user => ({
      ...user,
      password: undefined // Ne jamais retourner les mots de passe
    }));
  }

  async getById(id) {
    await this.delay();
    const user = this.users.find(item => item.Id === parseInt(id));
    if (!user) {
      throw new Error(`Utilisateur avec l'ID ${id} introuvable`);
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async create(userData) {
    await this.delay();
    
    // Vérifier l'unicité du nom d'utilisateur et de l'email
    const existingUsername = this.users.find(u => 
      u.username.toLowerCase() === userData.username.toLowerCase()
    );
    if (existingUsername) {
      throw new Error('Ce nom d\'utilisateur existe déjà');
    }

    const existingEmail = this.users.find(u => 
      u.email.toLowerCase() === userData.email.toLowerCase()
    );
    if (existingEmail) {
      throw new Error('Cette adresse email existe déjà');
    }

    const newId = Math.max(...this.users.map(u => u.Id)) + 1;
    const newUser = {
      Id: newId,
      username: userData.username,
      email: userData.email,
      role: userData.role || 'User',
      password: this.hashPassword(userData.password),
      active: userData.active !== undefined ? userData.active : true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    this.users.push(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async update(id, updates) {
    await this.delay();
    const index = this.users.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Utilisateur avec l'ID ${id} introuvable`);
    }

    const currentUser = this.users[index];
    
    // Vérifier l'unicité si username ou email sont modifiés
    if (updates.username && updates.username !== currentUser.username) {
      const existingUsername = this.users.find(u => 
        u.Id !== parseInt(id) && 
        u.username.toLowerCase() === updates.username.toLowerCase()
      );
      if (existingUsername) {
        throw new Error('Ce nom d\'utilisateur existe déjà');
      }
    }

    if (updates.email && updates.email !== currentUser.email) {
      const existingEmail = this.users.find(u => 
        u.Id !== parseInt(id) && 
        u.email.toLowerCase() === updates.email.toLowerCase()
      );
      if (existingEmail) {
        throw new Error('Cette adresse email existe déjà');
      }
    }

    // Hasher le nouveau mot de passe si fourni
    if (updates.password) {
      updates.password = this.hashPassword(updates.password);
    }

    this.users[index] = { ...currentUser, ...updates };
    
    const { password, ...userWithoutPassword } = this.users[index];
    return userWithoutPassword;
  }

  async delete(id) {
    await this.delay();
    const index = this.users.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Utilisateur avec l'ID ${id} introuvable`);
    }

    const deletedUser = this.users.splice(index, 1)[0];
    const { password, ...userWithoutPassword } = deletedUser;
    return userWithoutPassword;
  }

  async getByRole(role) {
    await this.delay();
    return this.users
      .filter(user => user.role === role)
      .map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
  }

  async toggleUserStatus(id) {
    await this.delay();
    const index = this.users.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Utilisateur avec l'ID ${id} introuvable`);
    }

    this.users[index].active = !this.users[index].active;
    
    const { password, ...userWithoutPassword } = this.users[index];
    return userWithoutPassword;
  }
}

export default new UserService();