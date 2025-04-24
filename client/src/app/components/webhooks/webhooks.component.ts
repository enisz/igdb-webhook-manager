import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faSquare,
  faSquareCheck,
  faSquareMinus,
  faSquarePlus,
  faTrashCan,
} from '@fortawesome/free-regular-svg-icons';
import {
  faArrowsRotate,
  faGear,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  NgbModal,
  NgbModalRef,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { finalize, forkJoin } from 'rxjs';
import { IWebhook } from '../../app.interface';
import { DisabledButtonDirective } from '../../directives/disabled-button.directive';
import { IgdbDatePipe } from '../../pipes/igdb-date.pipe';
import { ApiService } from '../../services/api.service';
import { TokenService } from '../../services/token.service';
import { ConfirmationModalComponent } from '../modals/confirmation-modal/confirmation-modal.component';
import { SettingsModalComponent } from '../modals/settings-modal/settings-modal.component';
import { NewWebhookModalComponent } from '../modals/new-webhook-modal/new-webhook-modal.component';

export interface IsSelected {
  selected: boolean;
}

export type WebhookWithSelected = IWebhook & IsSelected;

@Component({
  selector: 'app-webhooks',
  imports: [
    IgdbDatePipe,
    FontAwesomeModule,
    NgbTooltipModule,
    RouterModule,
    CommonModule,
    DisabledButtonDirective,
  ],
  templateUrl: './webhooks.component.html',
  styleUrl: './webhooks.component.scss',
})
export class WebhooksComponent implements OnInit {
  icons = {
    faArrowsRotate,
    faGear,
    faPlus,
    faSquare,
    faSquareCheck,
    faSquareMinus,
    faSquarePlus,
    faTrashCan,
  };
  tooltip = {
    placement: 'top',
    openDelay: 300,
    closeDelay: 300,
  };

  webhooks: WebhookWithSelected[] = [];
  loading = false;
  deleting = false;

  private modalRef: NgbModalRef | undefined;
  @ViewChild('toggleAll') toggleAll!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly apiService: ApiService,
    private readonly tokenService: TokenService,
    private readonly modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.isAccessTokenSet()) this.onRefresh();
  }

  onAddWebhook(): void {
    this.modalRef = this.modalService.open(NewWebhookModalComponent);

    this.modalRef.result
      .then(() => console.log('ok'))
      .catch(() => console.log('not ok'));
  }

  onRefresh(): void {
    if (!this.isAccessTokenSet()) return;

    this.loading = true;
    this.apiService
      .getWebhooks()
      .pipe(
        finalize(() => {
          this.loading = false;
          console.log('finalize');
        })
      )
      .subscribe(
        (webhooks: IWebhook[]) =>
          (this.webhooks = webhooks.map((webhook: IWebhook) => ({
            ...webhook,
            selected: false,
          })))
      );
  }

  onSettings(): void {
    this.modalRef = this.modalService.open(SettingsModalComponent);
    this.modalRef.result.then(this.onRefresh.bind(this));
  }

  onDeleteSelected(): void {
    this.showDeleteModal().then(() => {
      this.deleting = true;

      forkJoin(
        this.getSelectedWebhooks().map((webhook: WebhookWithSelected) =>
          this.apiService.deleteWebhook(webhook.id)
        )
      )
        .pipe(finalize(() => (this.deleting = false)))
        .subscribe((deletedWebhooks: IWebhook[]) => {
          this.onRefresh();
        });
    });
  }

  private showDeleteModal(): Promise<boolean> {
    const deleteModalRef = this.modalService.open(ConfirmationModalComponent);
    const selectedWebhooks = this.getSelectedWebhooks();

    deleteModalRef.componentInstance.title = 'Deleting Webhooks';
    deleteModalRef.componentInstance.okText = 'Delete';
    deleteModalRef.componentInstance.okColor = 'danger';
    deleteModalRef.componentInstance.headerClasses = [
      'bg-danger',
      'text-white',
    ];
    deleteModalRef.componentInstance.messages = [
      `This will permanently remove the selected ${
        selectedWebhooks.length
      } webhook${selectedWebhooks.length ? 's' : ''}!`,
      'Are you sure?',
    ];

    return deleteModalRef.result;
  }

  isAccessTokenSet(): boolean {
    return this.tokenService.isAccessTokenSet();
  }

  onToggleAll(event: Event): void {
    const { checked } = event.currentTarget as HTMLInputElement;

    for (const webhook of this.webhooks) {
      webhook.selected = checked;
    }
  }

  onCheckboxChange(event: Event): void {
    const { value, checked } = event.currentTarget as HTMLInputElement;
    const webhook = this.webhooks.find(
      (webhook: WebhookWithSelected) => webhook.id === parseInt(value)
    );

    if (webhook) {
      webhook.selected = checked;

      console.log({
        webhooksLength: this.webhooks.length,
        selected: this.getSelectedWebhooks(),
        equals: this.webhooks.length === this.getSelectedWebhooks().length,
      });
      this.toggleAll.nativeElement.checked =
        this.getSelectedWebhooks().length === this.webhooks.length;
    }
  }

  getSelectedWebhooks(): WebhookWithSelected[] {
    return this.webhooks.filter(
      (webhook: WebhookWithSelected) => webhook.selected
    );
  }
}
