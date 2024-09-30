import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() { }
  http = inject(HttpClient);

  // Method to create headers with JWT token
  private createHeaders() {
    const token = localStorage.getItem('token'); // Get token from storage
    const headers = new HttpHeaders({
      'Authorization': `${token}`,  // Attach token to the header
    });
    return { headers: headers };
  }

  EditBook(bookid: string, obj: any) {
    return this.http.put(`http://localhost:5000/api/bookmanagment/UpdateBook/${bookid}`, obj, this.createHeaders());
  }

  AddBook(obj: any) {
    return this.http.post(`http://localhost:5000/api/bookmanagment/AddBook`, obj, this.createHeaders());
  }

  GetBooks(url: any) {
    return this.http.get<any>(url, this.createHeaders());
  }

  DelBook(bookid: string) {
    return this.http.delete(`http://localhost:5000/api/bookmanagment/DeleteBook/${bookid}`, this.createHeaders());
  }

}
