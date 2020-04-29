import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayOrderDialogComponent } from './pay-order-dialog.component';

describe('PayOrderDialogComponent', () => {
  let component: PayOrderDialogComponent;
  let fixture: ComponentFixture<PayOrderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayOrderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
