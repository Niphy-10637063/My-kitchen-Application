import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCancelConfirmationComponent } from './order-cancel-confirmation.component';

describe('OrderCancelConfirmationComponent', () => {
  let component: OrderCancelConfirmationComponent;
  let fixture: ComponentFixture<OrderCancelConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderCancelConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderCancelConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
