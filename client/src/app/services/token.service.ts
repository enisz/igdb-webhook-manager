import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private clientIdKey = 'client-id';
  private clientSecretKey = 'client-secret';
  private accessTokenKey = 'access-token';

  destroy(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

  isClientIdSet(): boolean {
    return this.getClientId().length > 0;
  }

  isClientSecretSet(): boolean {
    return this.getClientSecret().length > 0;
  }

  isAccessTokenSet(): boolean {
    return this.getAccessToken().length > 0;
  }

  getClientId(): string {
    return localStorage.getItem(this.clientIdKey) || '';
  }

  getClientSecret(): string {
    return localStorage.getItem(this.clientSecretKey) || '';
  }

  getAccessToken(): string {
    return localStorage.getItem(this.accessTokenKey) || '';
  }

  setClientId(clientId: string): void {
    localStorage.setItem(this.clientIdKey, clientId);
  }

  setClientSecret(clientSecret: string): void {
    localStorage.setItem(this.clientSecretKey, clientSecret);
  }

  setAccessToken(accessToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }
}
