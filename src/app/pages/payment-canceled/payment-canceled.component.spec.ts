import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCanceledComponent } from './payment-canceled.component';

describe('PaymentCanceledComponent', () => {
  let component: PaymentCanceledComponent;
  let fixture: ComponentFixture<PaymentCanceledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCanceledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCanceledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
