import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/counter.state';
import { BookDetailInterface } from '../../interface';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BorrowService } from '../../Services/borrow.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent implements OnInit {

  store = inject(Store<AppState>);
  router = inject(Router);
  activatedroute = inject(ActivatedRoute)
  bookId: any
  DetailBook: any
  http = inject(HttpClient);
  private borrowservice = inject(BorrowService);
  userid: any
  url: string = "http://localhost:5000/api/boorowmanagment/borrow-requests";
  isRequestPending: boolean = false;


  ngOnInit(): void {
    this.activatedroute.params.subscribe(params => {
      this.bookId = params['id'];
      console.log(this.bookId, "bookid");

      this.fetchBookDetails();
    });
  }

  private fetchBookDetails() {
    this.store.select(state => state.AllBooks.AllBooks).subscribe((res: any) => {
      const Book = res.find((book: any) => book.id === this.bookId);
      if (Book) {
        console.log(Book);
        this.DetailBook = Book;
      } else {
        console.log('Book not found');
      }
    });
  }

  RequestborrowBook() {
    this.store.select(state => state.LoginData.LoginData).subscribe((res: any) => {
      // console.log(res[0].id , this.bookId);

      if (res && res[0].id && this.bookId) {
        console.log("ok");
        this.isRequestPending = true;
        this.borrowservice.BorrowRequest(this.url, res[0].id, this.bookId).subscribe(
          response => {
            console.log('Borrow request successful', response);
          },
          error => {
            console.error('Borrow failed', error);
            this.isRequestPending = false; 
          }
        );
      } else {
        console.error('User ID or Book ID is missing');
      }
    });
  }

}
