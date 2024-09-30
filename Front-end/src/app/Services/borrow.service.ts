import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {

  private createHeaders() {
    const token = localStorage.getItem('token'); // Get token from storage
    const headers = new HttpHeaders({
      'Authorization': `${token}`,  // Attach token to the header
    });
    return { headers: headers };
  }

  constructor() { }
  http = inject(HttpClient);

  BorrowRequest(url: string, user_id: string, book_id: string) {
    return this.http.post(url, { user_id, book_id }, this.createHeaders())
  }

  GetBorrowRequest(): Observable<any> {
    return this.http.get<any>("http://localhost:5000/api/boorowmanagment/get-borrow-requests", this.createHeaders())
  }

  UpdateStatusBorrowRequests(id: any, status: any): Observable<any> {
    return this.http.put(`http://localhost:5000/api/boorowmanagment/adminapprove/${id}`, status)
  }

  GetBorrowBooks(): Observable<any> {
    return this.http.get(`http://localhost:5000/api/boorowmanagment/DetailofBorrows` , this.createHeaders())
  }

  ReturnBook(user_id : any , book_id:any) : Observable <any> {
    return this.http.post("http://localhost:5000/api/boorowmanagment/ReturnBook" , {user_id , book_id} , this.createHeaders())
  }

}
