import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/counter.state';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BorrowService } from '../../Services/borrow.service';
import { GetDataService } from '../../Services/get-data.service';

@Component({
  selector: 'app-borrowed-books-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './borrowed-books-list.component.html',
  styleUrl: './borrowed-books-list.component.css'
})
export class BorrowedBooksListComponent implements OnInit {

  store = inject(Store<AppState>);
  router = inject(Router);
  bookId: any
  Book: any
  http = inject(HttpClient);
  private getdataservice = inject(GetDataService)
  private borrowservice = inject(BorrowService);
  userid: any
  url: string = "http://localhost:5000/api/boorowmanagment/ReturnBook";
  url2: string = "http://localhost:5000/api/boorowmanagment/DetailofBorrows";

  ReturnborrowBook(bookid: string) {
    this.store.select(state => state.LoginData.LoginData).subscribe((res: any) => {
      // console.log(res[0].id , this.bookId);
      this.bookId = bookid
      if (res && res[0].id && this.bookId) {
        console.log("ok");

        this.borrowservice.BorrowRequest(this.url, res[0].id, this.bookId).subscribe(
          response => {
            console.log('Return Borrow successful', response);
          },
          error => {
            console.error('Return Borrow failed', error);
          }
        );
      } else {
        console.error('User ID or Book ID is missing');
      }
    });
  }

  ngOnInit(): void {
    this.fetchBorrowsBooks();
  }

  fetchBorrowsBooks() {
    this.getdataservice.GetData("http://localhost:5000/api/boorowmanagment/DetailofBorrows").subscribe((res: any) => {
      console.log(res);
    })
  }

}
