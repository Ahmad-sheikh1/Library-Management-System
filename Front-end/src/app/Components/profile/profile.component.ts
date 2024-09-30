import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/counter.state';
import { selectLoginData } from '../../store/counter.selector';
import { map } from 'rxjs';
import { BorrowService } from '../../Services/borrow.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  activeTab: string = 'profile';
  store = inject(Store<AppState>);
  private borrowservice = inject(BorrowService)
  profileinfo: any
  borroerequests: any
  borrowbooks: any

  ngOnInit(): void {
    this.store.select(state => state.LoginData.LoginData).subscribe(res => {
      console.log(res[0].email);
      this.profileinfo = res[0]
    });

    this.borrowservice.GetBorrowRequest().subscribe(res => {
      this.borroerequests = res.data
    })

    this.borrowservice.GetBorrowBooks().subscribe(res => {
      this.borrowbooks = res.data
    })

  }

  ReturnBook(userid: any, bookid: any) {
    this.borrowservice.ReturnBook(userid, bookid).subscribe(res => {
      this.borrowbooks = this.borrowbooks.filter((book: { book_id: any; }) => book.book_id      !== bookid);
    })
  }


  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
