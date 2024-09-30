import { Component, inject, OnInit } from '@angular/core';
import { BorrowService } from '../../Services/borrow.service';

@Component({
  selector: 'app-admin-approval',
  standalone: true,
  imports: [],
  templateUrl: './admin-approval.component.html',
  styleUrl: './admin-approval.component.css'
})
export class AdminApprovalComponent implements OnInit {
  borrowservice = inject(BorrowService);
  books: any;

  ngOnInit(): void {
    this.borrowservice.GetBorrowRequest().subscribe(res => {
      console.log(res.data);
      this.books = res.data
    })
  }

  updateBorrowRequestStatus(id: string, status: string): void {
    this.borrowservice.UpdateStatusBorrowRequests(id, { status }).subscribe(
      response => {
        console.log('Borrow request status updated successfully', response);
        this.ngOnInit(); 
      },
      error => {
        console.error('Error updating borrow request status:', error);
      }
    );
  }

}
