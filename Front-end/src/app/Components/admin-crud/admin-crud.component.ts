import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { AppState } from '../../store/counter.state';
import { Store } from '@ngrx/store';
import { BookService } from '../../Services/book.service';

@Component({
  selector: 'app-admin-crud',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './admin-crud.component.html',
  styleUrls: ['./admin-crud.component.css']
})
export class AdminCrudComponent {
  faPenToSquare = faPenToSquare;
  store = inject(Store<AppState>);
  faTrash = faTrashAlt;
  isModalVisible: boolean = false;
  isAddModalVisible: boolean = false;
  bookid: any;
  url: string = "http://localhost:5000/api/bookmanagment/AllBooks";

  // Define pages and quantity as numbers
  formObj = {
    title: '',
    author: '',
    publisher: '',
    language: '',
    pages: 0, // default number
    quantity: 0, // default number
    genre: '',
    description: ''
  };

  // Define pages and quantity as numbers
  Addformobj = {
    title: '',
    author: '',
    publisher: '',
    language: '',
    pages: 0, // default number
    quantity: 0, // default number
    genre: '',
    description: ''
  };

  books: any;
  selectedFile: File | null = null;
  private bookservice = inject(BookService);
  selectedTab: string = 'crud';

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Get the first selected file
    }
  }

  isModelOpen(bookId: string) {
    this.bookid = bookId;
    const bookToEdit = this.books.find((book: { id: string; }) => book.id === bookId);
    if (bookToEdit) {
      this.formObj = { ...bookToEdit }; // Copy current book data into the formObj
      this.isModalVisible = true; // Open modal
    }
  }

  iscloseModal() {
    this.isModalVisible = false;
  }

  isAddcloseModal() {
    this.isAddModalVisible = false;
  }

  isAddopenModal() {
    this.isAddModalVisible = true;
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  submitForm() {
    console.log(this.formObj);
    if (this.bookid && this.formObj) {
      this.bookservice.EditBook(this.bookid, this.formObj).subscribe((res: any) => {
        console.log(res);
        const index = this.books.findIndex((book: { id: string }) => book.id === this.bookid);
        if (index !== -1) {
          this.books[index] = { ...this.books[index], ...this.formObj }; // Update the specific book
        }
        this.iscloseModal();
      });
    }
  }

  ngOnInit(): void {
    this.bookservice.GetBooks(this.url).subscribe(books => {
      this.books = books.data;
      console.log(books);
    });
  }

  AddBook() {
    const formData = new FormData(); // Create a FormData object

    // Append book details to FormData
    formData.append('title', this.Addformobj.title);
    formData.append('author', this.Addformobj.author);
    formData.append('publisher', this.Addformobj.publisher);
    formData.append('language', this.Addformobj.language);
    formData.append('pages', this.Addformobj.pages.toString()); // Convert to string
    formData.append('quantity', this.Addformobj.quantity.toString()); // Convert to string
    formData.append('genre', this.Addformobj.genre);
    formData.append('description', this.Addformobj.description);

    // Append the selected file if it exists
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    console.log(this.Addformobj);
    if (this.Addformobj) {
      this.bookservice.AddBook(formData).subscribe((res: any) => {
        console.log(res);
        this.books.push(res.data);
        // Reset Addformobj after submission
        this.Addformobj = { title: '', author: '', publisher: '', language: '', pages: 0, quantity: 0, genre: '', description: '' };
        this.isAddcloseModal();
      }, error => {
        console.error("Error adding book:", error);
      });
    }
  }

  DelBook(bookid: string) {
    this.bookservice.DelBook(bookid).subscribe((res: any) => {
      console.log(res);
      this.books = this.books.filter((book: any) => book.id !== bookid);
    });
  }
}
