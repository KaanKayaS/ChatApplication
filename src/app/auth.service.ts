import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated(): boolean {
    try {
      const userInfo = localStorage.getItem('userInfo');
      return !!userInfo && JSON.parse(userInfo)?.id;
    } catch {
      return false;
    }
  }

  getUserInfo() {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) return null;
      
      const userInfo = JSON.parse(userInfoStr);
      if (!userInfo || !userInfo.id) return null;
      
      return userInfo;
    } catch (error) {
      console.error('Error parsing user info:', error);
      localStorage.clear(); // Hatalı veri varsa temizle
      return null;
    }
  }
}
