import CryptoJS from 'crypto-js';
import usersData from '@/services/mockData/users.json';

class AuthService {
  constructor() {
    this.users = [...usersData];
    this.storageKey = 'matiguard_user';
    this.sessionTimeout = 8 * 60 * 60 * 1000; // 8 heures
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
  }

  hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
  }

  async login(username, password) {
    await this.delay();
    
    const user = this.users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === this.hashPassword(password)
    );

    if (!user) {
      throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
    }

    if (!user.active) {
      throw new Error('Compte désactivé. Contactez l\'administrateur.');
    }

    const sessionData = {
      id: user.Id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: this.getRolePermissions(user.role),
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + this.sessionTimeout).toISOString()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(sessionData));
    return sessionData;
  }

  logout() {
    localStorage.removeItem(this.storageKey);
  }

  getCurrentUser() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return null;

      const userData = JSON.parse(stored);
      
      // Vérifier l'expiration de la session
      if (new Date() > new Date(userData.expiresAt)) {
        this.logout();
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      this.logout();
      return null;
    }
  }

  getRolePermissions(role) {
    const permissions = {
      'Administrator': ['create', 'read', 'update', 'delete', 'export', 'manage_users', 'system_config'],
      'Manager': ['create', 'read', 'update', 'delete', 'export'],
      'User': ['read']
    };
    return permissions[role] || [];
  }

  async refreshSession() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const newExpiresAt = new Date(Date.now() + this.sessionTimeout).toISOString();
    const updatedUser = {
      ...currentUser,
      expiresAt: newExpiresAt
    };

    localStorage.setItem(this.storageKey, JSON.stringify(updatedUser));
    return updatedUser;
  }

  async validateToken() {
    await this.delay();
    const user = this.getCurrentUser();
    return !!user;
  }

  async changePassword(currentPassword, newPassword) {
    await this.delay();
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Utilisateur non connecté');
    }

    const dbUser = this.users.find(u => u.Id === user.id);
    if (!dbUser || dbUser.password !== this.hashPassword(currentPassword)) {
      throw new Error('Mot de passe actuel incorrect');
    }

    if (newPassword.length < 6) {
      throw new Error('Le nouveau mot de passe doit contenir au moins 6 caractères');
    }

    // Mettre à jour le mot de passe dans les données mockées
    dbUser.password = this.hashPassword(newPassword);
    
    return { success: true, message: 'Mot de passe modifié avec succès' };
  }

  hasRole(userRole, requiredRole) {
    const roleHierarchy = {
      'Administrator': 3,
      'Manager': 2,
      'User': 1
    };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  hasPermission(userPermissions, permission) {
    return userPermissions?.includes(permission) || false;
  }

  isSessionExpired(userData) {
    if (!userData || !userData.expiresAt) return true;
    return new Date() > new Date(userData.expiresAt);
  }

  getSessionInfo() {
    const user = this.getCurrentUser();
    if (!user) return null;

    const now = new Date();
    const expiresAt = new Date(user.expiresAt);
    const timeLeft = Math.max(0, expiresAt.getTime() - now.getTime());

    return {
      user,
      isExpired: timeLeft === 0,
      timeLeft,
      timeLeftFormatted: this.formatTime(timeLeft)
    };
  }

  formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
}

export default new AuthService();