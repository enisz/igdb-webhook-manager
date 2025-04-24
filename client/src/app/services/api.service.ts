import { inject, Injectable } from '@angular/core';
import { IAuthenticateResponse, IWebhook } from '../app.interface';
import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  EndpointType,
  ICreateWebhook,
} from '../components/webhook/webhook.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly httpClient = inject(HttpClient);

  authenticate(
    clientId: string,
    clientSecret: string
  ): Observable<IAuthenticateResponse> {
    return this.httpClient.post<IAuthenticateResponse>(
      'api/igdb/authenticate',
      { clientId, clientSecret }
    );
  }

  getWebhooks(): Observable<IWebhook[]> {
    return this.httpClient.get<IWebhook[]>('api/igdb/webhooks', {
      headers: { ...this.getAuthorizationHeaders() },
    });
  }

  getWebhook(webhookId: number): Observable<IWebhook> {
    return this.httpClient.get<IWebhook>(`api/igdb/webhook/${webhookId}`, {
      headers: { ...this.getAuthorizationHeaders() },
    });
  }

  createWebhook(
    endpoint: EndpointType,
    webhook: ICreateWebhook
  ): Observable<IWebhook> {
    return this.httpClient.post<IWebhook>(
      `api/igdb/webhook/${endpoint}`,
      webhook,
      { headers: { ...this.getAuthorizationHeaders() } }
    );
  }

  deleteWebhook(webhookId: number): Observable<IWebhook> {
    return this.httpClient.delete<IWebhook>(`api/igdb/webhook/${webhookId}`, {
      headers: { ...this.getAuthorizationHeaders() },
    });
  }

  updateWebhook(
    webhookId: number,
    endpoint: EndpointType,
    webhook: ICreateWebhook
  ): Observable<IWebhook> {
    return this.createWebhook(endpoint, webhook).pipe(
      switchMap((newWebhook) =>
        this.deleteWebhook(webhookId).pipe(
          catchError((deleteError) => {
            console.warn(
              `Failed to delete old webhook (ID: ${webhookId}):`,
              deleteError
            );
            return of(null);
          }),
          map(() => newWebhook)
        )
      ),
      catchError((createError) => {
        console.error('Failed to create new webhook:', createError);
        throw createError;
      })
    );
  }

  private getAuthorizationHeaders(): Record<string, string> {
    return {
      'Client-ID': localStorage.getItem('client-id') || '',
      'Authorization': `Bearer ${localStorage.getItem('access-token')}` || '',
    };
  }
}
