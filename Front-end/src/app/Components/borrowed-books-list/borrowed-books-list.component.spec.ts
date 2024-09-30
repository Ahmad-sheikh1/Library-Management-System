import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowedBooksListComponent } from './borrowed-books-list.component';

describe('BorrowedBooksListComponent', () => {
  let component: BorrowedBooksListComponent;
  let fixture: ComponentFixture<BorrowedBooksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowedBooksListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowedBooksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
