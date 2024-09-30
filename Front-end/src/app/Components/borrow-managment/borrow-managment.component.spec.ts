import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowManagmentComponent } from './borrow-managment.component';

describe('BorrowManagmentComponent', () => {
  let component: BorrowManagmentComponent;
  let fixture: ComponentFixture<BorrowManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
