import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.scss',
})
export class ConfirmationModalComponent {
  @Input('title') title!: string;
  @Input('message') messages!: string[];
  @Input('okColor') okColor = 'primary';
  @Input('okText') okText = 'Ok';
  @Input('cancelColor') cancelColor = 'outline-secondary';
  @Input('cancelText') cancelText = 'Cancel';
  @Input('headerClasses') headerClasses = ['bg-primary', 'text-white'];

  constructor(private readonly activeModal: NgbActiveModal) {}

  onOk(): void {
    this.activeModal.close();
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }
}
