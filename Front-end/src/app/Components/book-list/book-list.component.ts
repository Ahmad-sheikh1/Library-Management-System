import { Component, inject, OnInit } from '@angular/core';
import { BookService } from '../../Services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AllBooksAction } from '../../store/counter.action';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/counter.state';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store<AppState>)

  books: any[] = [];
  filteredBooks: any[] = [];
  selectedCategories: string[] = [];
  url: string = "http://localhost:5000/api/bookmanagment/AllBooks";
  categories: string[] = [
    'Fantasy',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Horror',
    'Thriller',
    'Biography',
    'Historical Fiction'
  ];

  isSelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  toggleCategory(category: string): void {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(cat => cat !== category);
    } else {
      this.selectedCategories.push(category);
      this.filterBooks()
    }
    console.log(this.selectedCategories); 
  }

  filterBooks(): void {
    this.bookService.GetBooks(this.url).subscribe(books => {
      console.log(this.books , 'books');
      this.store.dispatch(AllBooksAction({ books: books.data }))
      
      this.books = books.data;
      this.filteredBooks = this.books.filter(book => {
        return this.selectedCategories.some(category => book.genre == category)
      })
      console.log(this.filteredBooks);
      
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const cateogry = params['id'];
      this.selectedCategories = [cateogry];
      this.filterBooks();
      console.log(this.selectedCategories);

    })
  }

  Redirect(id: string) {
    this.router.navigate(['Home/DetailPage/', id])
  }


} 
