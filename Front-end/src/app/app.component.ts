import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { TokenServiceService } from './Services/token-service.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/counter.state';
import { LoginDataAction } from './store/counter.action';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular-practice-project';
  constructor(private tokenservice: TokenServiceService) { }
  store = inject(Store<AppState>)
  router = inject(Router)
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    // console.log(token);
    
    if (token) {
      this.tokenservice.verifyToken(token).subscribe((res: any) => {
        // console.log(res);
        this.router.navigateByUrl('/Home')
        this.store.dispatch(LoginDataAction({ LoginData: res.user }))
      }, (error) => {
        console.error('Token verification failed', error);
        localStorage.removeItem('token');
        this.router.navigateByUrl('/Login')
      })
    }
  }
}