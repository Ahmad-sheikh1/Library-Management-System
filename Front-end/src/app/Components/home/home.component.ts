import { CommonModule, NgFor } from '@angular/common';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiResponse, Genre } from '../../interface';
import { AppState } from '../../store/counter.state';
import { StateI } from '../../store/counter.reducers';
import { Store } from '@ngrx/store';
import { AllBooksAction } from '../../store/counter.action';
import { Observable } from 'rxjs';
import { BookService } from '../../Services/book.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent implements OnInit {
  // AllBook$: Observable<any[]>;

  // constructor(private store: Store<{ AllBooks: StateI }>) { }
  store = inject(Store<AppState>)
  router = inject(Router);
  http = inject(HttpClient)
  private bookservice = inject(BookService)
  url: string = "http://localhost:5000/api/bookmanagment/AllBooks"
  genres: Genre[] = [
    {
      Gener: "Fantasy",
      Description: "A genre of speculative fiction involving magical elements.",
      ImageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWKy2-K-iwG-8t5DIvpOQkdIDBQoPtC1ebjA&s"
    },
    {
      Gener: "Science Fiction",
      Description: "Fiction based on futuristic concepts and advanced technology.",
      ImageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHN-CNwAlBblKiwelLstT5dPUXsLJ5crotMw&s"
    },
    {
      Gener: "Mystery",
      Description: "Fiction dealing with the solution of a crime or unraveling a puzzle.",
      ImageURL: "https://celadonbooks.com/wp-content/uploads/2020/03/what-is-a-mystery.jpg"
    },
    {
      Gener: "Romance",
      Description: "Fiction centered on romantic relationships between characters.",
      ImageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNf_D8Yf3EnZCVB1suhlUrVUxEFT2PQmGAMQ&s"
    },
    {
      Gener: "Horror",
      Description: "Fiction intended to frighten, scare, or disgust the reader.",
      ImageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrx516W_3U8r08CEOjH3ZeeXL1W1UVttshtA&s"
    },
    {
      Gener: "Thriller",
      Description: "Fiction characterized by excitement, suspense, and high stakes.",
      ImageURL: "https://hips.hearstapps.com/hmg-prod/images/hbz-thriller-index-1593712464.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=1200:*"
    },
    {
      Gener: "Biography",
      Description: "A detailed description of a person's life.",
      ImageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdCDMiGnEk1NhlxBr1K55R0_U5XieHER7R3A&s"
    },
    {
      Gener: "Historical Fiction",
      Description: "Fiction set in the past, often with historical events or figures.",
      ImageURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL0wtU39F5TZ6aqSjKekxjR6EigGOoMmpIiw&s"
    },
  ];



  GetAllBooks() {
    // this.http.get<ApiResponse>("http://localhost:5000/api/bookmanagment/AllBooks").subscribe(res => {
    //   console.log(res.data);
    //   this.store.dispatch(AllBooksAction({ books: res.data }))
    // })
    this.bookservice.GetBooks(this.url).subscribe((res: any) => {
      console.log(res);
      this.store.dispatch(AllBooksAction({ books: res.data }))
    })
  }

  books: any
  ngOnInit(): void {
    // this.GetAllBooks()
    this.store.select(state => state.AllBooks.AllBooks).subscribe((books) => {
      // console.log(books)
      this.books = books

    })
  }

  

  onCategoryClick(genre: string) {
    this.router.navigate(['/product', genre]);
  }

}
