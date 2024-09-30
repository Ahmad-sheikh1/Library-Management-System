import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/counter.state';
import { selectLoginData } from '../../store/counter.selector';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  openmenu: boolean = false;
  isAdmin: boolean = false; // Initialize as false
  router = inject(Router)

  store = inject(Store<AppState>);

  ngOnInit(): void {
    // Select login data from store
    this.store.select(selectLoginData).pipe(
      map(loginData => {
        if (loginData?.LoginData && loginData.LoginData.length > 0) {
          const user = loginData.LoginData[0]; // Get the first user (assuming only one logged in)
          this.isAdmin = user.role === 'admin'; // Check if role is admin
          console.log("User role:", user.role); // Debug log
        }
      })
    ).subscribe(); // Subscribe to the observable to trigger the stream
  }

  ismenuopen() {
    this.openmenu = !this.openmenu; // Toggle menu
  }

  Logout() {
    localStorage.removeItem("token");
    this.router.navigate(['/Login'])
  }
}
