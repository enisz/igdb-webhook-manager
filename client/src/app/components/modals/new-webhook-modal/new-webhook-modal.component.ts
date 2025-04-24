import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WEBHOOK_CATEGORY, WEBHOOK_METHOD } from '../../webhook/webhook.const';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import {
  EndpointType,
  WebhookMethodType,
} from '../../webhook/webhook.interface';
import { catchError, finalize, of } from 'rxjs';
import { IWebhook } from '../../../app.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-webhook-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './new-webhook-modal.component.html',
  styleUrl: './new-webhook-modal.component.scss',
})
export class NewWebhookModalComponent implements OnInit {
  webhookForm: FormGroup;
  saving = false;
  errors = {
    url: [],
    endpoint: [],
    method: [],
    secret: [],
  };

  get url(): string {
    return this.webhookForm.get('url')?.value || '';
  }
  get endpoint(): string {
    return this.webhookForm.get('endpoint')?.value || '';
  }
  get method(): string {
    return this.webhookForm.get('method')?.value || '';
  }
  get secret(): string {
    return this.webhookForm.get('secret')?.value || '';
  }

  set endpoint(newEndpoint: number) {
    this.webhookForm.get('endpoint')?.setValue(newEndpoint);
  }
  set method(newMethod: number) {
    this.webhookForm.get('method')?.setValue(newMethod);
  }

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly apiService: ApiService
  ) { this.webhookForm = new FormGroup({}); }

  ngOnInit(): void {
    this.webhookForm = new FormGroup({
      url: new FormControl('', [Validators.required]),
      endpoint: new FormControl(Object.keys(WEBHOOK_CATEGORY)[0], [Validators.required]),
      method: new FormControl(Object.keys(WEBHOOK_METHOD)[0], [Validators.required]),
      secret: new FormControl(null, [Validators.required]),
    });
  }

  onOk(): void {
    console.log({ method: this.method, methodType: this.getWebhookMethod(parseInt(this.method))})
    const endpoint = this.getWebhookEndpoint(parseInt(this.endpoint));
    const webhook = {
      url: this.url,
      method: this.getWebhookMethod(parseInt(this.method)),
      secret: this.secret,
    };

    console.log({ endpoint, webhook })

    this.saving = true;
    this.apiService
      .createWebhook(endpoint, webhook)
      .pipe(finalize(() => (this.saving = false)),
    catchError((createError: HttpErrorResponse) => {
      console.log({ createError })
      const { message } = createError.error

      console.log(message);
      throw createError;
    }))
      .subscribe((createdWebhook: IWebhook) =>
        this.activeModal.close(createdWebhook.id)
      );
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }

  getWebhookEndpoint(category: number | undefined): EndpointType {
    return (
      category !== undefined ? WEBHOOK_CATEGORY[category] : ''
    ) as EndpointType;
  }

  getWebhookEndpoints(): [number, string][] {
    return Object.keys(WEBHOOK_CATEGORY).map((key: string) => [
      parseInt(key),
      WEBHOOK_CATEGORY[parseInt(key)],
    ]);
  }

  getWebhookMethod(sub_category: number | undefined): WebhookMethodType {
    return (
      sub_category !== undefined ? WEBHOOK_METHOD[sub_category] : ''
    ) as WebhookMethodType;
  }

  getWebhookMethods(): [number, string][] {
    return Object.keys(WEBHOOK_METHOD).map((key: string) => [
      parseInt(key),
      WEBHOOK_METHOD[parseInt(key)],
    ]);
  }
}
