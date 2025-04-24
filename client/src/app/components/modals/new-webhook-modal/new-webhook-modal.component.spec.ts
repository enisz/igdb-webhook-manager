import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWebhookModalComponent } from './new-webhook-modal.component';

describe('NewWebhookModalComponent', () => {
  let component: NewWebhookModalComponent;
  let fixture: ComponentFixture<NewWebhookModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewWebhookModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewWebhookModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
