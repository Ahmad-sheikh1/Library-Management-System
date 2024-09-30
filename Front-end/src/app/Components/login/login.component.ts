import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms"
import { LoginApiResponse } from '../../interface';
import { LoginDataState } from '../../store/counter.reducers';
import { Store } from '@ngrx/store';
import { LoginDataAction } from '../../store/counter.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private store: Store<{ LoginData: LoginDataState }>) { }

  http = inject(HttpClient)
  router = inject(Router);

  userobj: any = {
    email: '',
    password: ''
  }
  formobj: any;

  formdata() {
    // event.preventDefault();
    this.http.post<LoginApiResponse>("http://localhost:5000/api/auth/LoginUser", this.userobj).subscribe((res) => {
      this.store.dispatch(LoginDataAction({ LoginData: res.data }));
      console.log(res);
      localStorage.setItem("token", res.token)
      this.router.navigateByUrl('Home')
    });
  }

  ngOnInit(): void {
    //   this.store.select(state => state.LoginData.LoginData).subscribe((res: any) => {
    //     console.log(res);
    //     if (res) {
    //       this.router.navigateByUrl('Home')
    //     }
    //   })
  }

}
