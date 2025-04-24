import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowLeft,
  faCheck,
  faPlay,
  faSpinner,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize, Subscription } from 'rxjs';
import { IWebhook } from '../../app.interface';
import { CanComponentDeactivate } from '../../guards/can-deactivate.guard';
import { IgdbDatePipe } from '../../pipes/igdb-date.pipe';
import { ApiService } from '../../services/api.service';
import { ConfirmationModalComponent } from '../modals/confirmation-modal/confirmation-modal.component';
import { WEBHOOK_CATEGORY, WEBHOOK_METHOD } from './webhook.const';
import { EndpointType, WebhookMethodType } from './webhook.interface';
import { DisabledButtonDirective } from '../../directives/disabled-button.directive';

@Component({
  selector: 'app-webhook',
  imports: [
    IgdbDatePipe,
    FontAwesomeModule,
    NgbTooltipModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    DisabledButtonDirective,
  ],
  templateUrl: './webhook.component.html',
  styleUrl: './webhook.component.scss',
})
export class WebhookComponent
  implements OnInit, CanComponentDeactivate, OnDestroy {
  webhookId = -1;
  webhook: IWebhook | null = null;
  loading = true;
  saving = false;
  edit = false;
  icons = {
    faArrowLeft,
    faTrashCan,
    faPenToSquare,
    faPlay,
    faCheck,
    faXmark,
    faSpinner,
  };
  editForm: FormGroup;
  subscriptions: Subscription[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly apiService: ApiService,
    private readonly modalService: NgbModal,
    private readonly router: Router
  ) {
    this.editForm = new FormGroup({
      url: new FormControl(),
      method: new FormControl(),
      secret: new FormControl(),
      endpoint: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params: Params) => {
        this.webhookId = params['webhookId'];
        this.loadWebhook(this.webhookId);
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription?.unsubscribe();
    }
  }

  loadWebhook(webhookId: number): void {
    this.loading = true;

    this.apiService
      .getWebhook(webhookId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((webhook: IWebhook) => (this.webhook = webhook));
  }

  async canDeactivate(): Promise<boolean> {
    if (this.edit && this.editForm.dirty) {
      return this.showUnsavedChangesModal();
    }

    return true;
  }

  onEdit(): void {
    this.edit = !this.edit;
    this.editForm.setValue({
      url: this.webhook?.url,
      secret: this.webhook?.secret,
      method: this.webhook?.sub_category,
      endpoint: this.webhook?.category,
    });
  }

  onActivate(): void {
    this.showActivateModal().then(() => console.log('activate!'));
  }

  onDelete(): void {
    this.showDeleteModal().then(() => {
      this.loading = true;
      this.apiService
        .deleteWebhook(this.webhook?.id as number)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe((deletedWebhook: IWebhook) =>
          this.router.navigate(['/webhooks'])
        );
    });
  }

  onSave(): void {
    const url = this.editForm.get('url')?.value || '';
    const secret = this.editForm.get('secret')?.value || '';
    const method = this.getWebhookMethod(
      parseInt(this.editForm.get('method')?.value)
    ) as WebhookMethodType;
    const endpoint = this.getWebhookEndpoint(
      parseInt(this.editForm.get('endpoint')?.value)
    ) as EndpointType;

    this.saving = true;
    this.editForm.disable();

    this.apiService
      .updateWebhook(this.webhook?.id as number, endpoint, {
        url,
        secret,
        method,
      })
      .pipe(finalize(() => (this.saving = false)))
      .subscribe((newWebhook: IWebhook) => {
        this.edit = false;
        this.editForm.enable();
        this.router.navigate(['/webhook', newWebhook.id]);
      });
  }

  onCancel(): void {
    if (this.editForm.dirty) {
      this.showUnsavedChangesModal().then(() => (this.edit = false));
    } else {
      this.edit = false;
    }
  }

  getWebhookEndpoint(category: number | undefined): string {
    return category !== undefined ? WEBHOOK_CATEGORY[category] : '';
  }

  getWebhookEndpoints(): [number, string][] {
    return Object.keys(WEBHOOK_CATEGORY).map((key: string) => [
      parseInt(key),
      WEBHOOK_CATEGORY[parseInt(key)],
    ]);
  }

  getWebhookMethod(sub_category: number | undefined): string {
    return sub_category !== undefined ? WEBHOOK_METHOD[sub_category] : '';
  }

  getWebhookMethods(): [number, string][] {
    return Object.keys(WEBHOOK_METHOD).map((key: string) => [
      parseInt(key),
      WEBHOOK_METHOD[parseInt(key)],
    ]);
  }

  private showUnsavedChangesModal(): Promise<boolean> {
    const confirmModalRef = this.modalService.open(ConfirmationModalComponent);
    confirmModalRef.componentInstance.title = 'Unsaved Changes';
    confirmModalRef.componentInstance.messages = [
      'Changes have been made to the form on the page. Unsaved data will be lost!',
      'Are you sure?',
    ];

    return confirmModalRef.result;
  }

  private showDeleteModal(): Promise<boolean> {
    const deleteModalRef = this.modalService.open(ConfirmationModalComponent);

    deleteModalRef.componentInstance.title = `Deleting Webhook #${this.webhook?.id}`;
    deleteModalRef.componentInstance.messages = [
      'Deleting this webhook will erase all data of the webhook.',
      'Are you sure?',
    ];

    deleteModalRef.componentInstance.okColor = 'danger';
    deleteModalRef.componentInstance.okText = 'Delete';
    deleteModalRef.componentInstance.headerClasses = [
      'bg-danger',
      'text-white',
    ];

    return deleteModalRef.result;
  }

  private showActivateModal(): Promise<boolean> {
    const activateModalRef = this.modalService.open(ConfirmationModalComponent);

    activateModalRef.componentInstance.title = `Activating Webhook #${this.webhook?.id}`;
    activateModalRef.componentInstance.messages = [
      'Activating the Webhook will delete this instance and will register a new one with the details of the current',
      `URL: ${this.webhook?.url}\nMethod: ${this.getWebhookMethod(
        this.webhook?.sub_category
      )}\nEndpoint: ${this.getWebhookEndpoint(
        this.webhook?.category
      )}\nSecret: ${this.webhook?.secret}`,
      'Are you sure?',
    ];

    activateModalRef.componentInstance.okText = 'Activate';

    return activateModalRef.result;
  }
}
