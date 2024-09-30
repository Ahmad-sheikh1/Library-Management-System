import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
interface Book {
  id: number;
  title: string;
  author: string;
}
@Component({
  selector: 'app-borrow-managment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './borrow-managment.component.html',
  styleUrl: './borrow-managment.component.css'
})
export class BorrowManagmentComponent {
  availableBooks: Book[] = [
    { id: 1, title: '1984', author: 'George Orwell' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  ];

  borrowedBooks: Book[] = [];

  borrowBook(book: Book): void {
    this.borrowedBooks.push(book);
    this.availableBooks = this.availableBooks.filter(b => b.id !== book.id);
  }

  returnBook(book: Book): void {
    this.availableBooks.push(book);
    this.borrowedBooks = this.borrowedBooks.filter(b => b.id !== book.id);
  }
}
