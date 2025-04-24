import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { IAuthenticateResponse } from '../../../app.interface';
import { ApiService } from '../../../services/api.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-settings-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule, CommonModule],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.scss',
})
export class SettingsModalComponent {
  settingsForm: FormGroup;
  icons = { faUserCheck, faSpinner };

  loading = false;
  authError: string | null = null;

  get clientId(): string {
    return this.settingsForm.get('clientId')?.value;
  }
  get clientSecret(): string {
    return this.settingsForm.get('clientSecret')?.value;
  }
  get accessToken(): string {
    return this.settingsForm.get('accessToken')?.value;
  }
  set clientId(newValue: string) {
    this.settingsForm.get('clientId')?.setValue(newValue);
  }
  set clientSecret(newValue: string) {
    this.settingsForm.get('clientSecret')?.setValue(newValue);
  }
  set accessToken(newValue: string) {
    this.settingsForm.get('accessToken')?.setValue(newValue);
  }

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly tokenService: TokenService,
    private readonly apiService: ApiService
  ) {
    this.settingsForm = new FormGroup({
      clientId: new FormControl(this.tokenService.getClientId()),
      clientSecret: new FormControl(this.tokenService.getClientSecret()),
      accessToken: new FormControl(this.tokenService.getAccessToken()),
    });
  }

  onSave(): void {
    this.tokenService.setClientId(this.clientId);
    this.tokenService.setClientSecret(this.clientSecret);
    this.tokenService.setAccessToken(this.accessToken);
    this.activeModal.close();
  }

  onCancel(): void {
    this.settingsForm.reset({
      clientId: this.tokenService.getClientId(),
      clientSecret: this.tokenService.getClientSecret(),
      accessToken: this.tokenService.getAccessToken(),
    });

    this.activeModal.close();
  }

  onDelete(): void {
    this.settingsForm.reset();
    this.tokenService.destroy();
    this.activeModal.close();
  }

  onAuthenticate(): void {
    if (this.clientId.length === 0 || this.clientSecret.length === 0) return;

    this.loading = true;

    this.apiService
      .authenticate(this.clientId, this.clientSecret)
      .pipe(
        finalize(() => (this.loading = false)),
        catchError(this.catchAuthError.bind(this))
      )
      .subscribe((response: IAuthenticateResponse) => {
        this.accessToken = response.access_token;
        this.authError = '';
      });
  }

  private catchAuthError(error: any): Observable<never> {
    this.authError = error?.error?.message;
    return throwError(() => new Error(error?.error?.message));
  }
}
