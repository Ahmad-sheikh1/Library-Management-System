import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor() { }
  http = inject(HttpClient);

  GetData(url: string): Observable<any> {
    return this.http.get(url);
  }

}
