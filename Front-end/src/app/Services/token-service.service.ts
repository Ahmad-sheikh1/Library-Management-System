import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenServiceService {

  constructor() { }
  http = inject(HttpClient);

  verifyToken(token: string): Observable<any> {
    // console.log(token);
    
    return this.http.post("http://localhost:5000/api/auth/VerifyTokenUser",{token})
  }

}
