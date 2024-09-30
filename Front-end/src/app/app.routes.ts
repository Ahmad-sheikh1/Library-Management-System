import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { BooksCrudComponent } from './Components/books-crud/books-crud.component';
import { BorrowedBooksListComponent } from './Components/borrowed-books-list/borrowed-books-list.component';
import { BorrowManagmentComponent } from './Components/borrow-managment/borrow-managment.component';
import { BookDetailComponent } from './Components/book-detail/book-detail.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { guardsGuard } from './guards.guard';
import { BookListComponent } from './Components/book-list/book-list.component';
import { adminGuard } from './admin.guard';
import { NotAuthorizedComponent } from './Components/not-authorized/not-authorized.component';
import { ProfileComponent } from './Components/profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'Home',
        pathMatch: 'full'
    },
    {
        path: 'product/:id',
        component: BookListComponent
    },
    {
        path: 'Home',
        component: HomeComponent,
        canActivate: [guardsGuard]
    },
    {
        path: 'not-authorized', // Route to redirect unauthorized users
        component: NotAuthorizedComponent // Ensure you create this component
    },
    {
        path: 'Books-Crud',
        component: BooksCrudComponent,
        canActivate: [guardsGuard, adminGuard]
    },
    {
        path: 'BorrwoedList',
        component: BorrowedBooksListComponent,
        canActivate: [guardsGuard]
    },
    {
        path: 'BorrowManagment',
        component: BorrowManagmentComponent,
        canActivate: [guardsGuard]
    },
    {
        path: 'Home/DetailPage/:id',
        component: BookDetailComponent,
        canActivate: [guardsGuard]
    },
    {
        path: 'Login',
        component: LoginComponent
    },
    {
        path: 'Register',
        component: RegisterComponent
    },
    {
        path: 'ProfilePage',
        component: ProfileComponent,
        canActivate: [guardsGuard]
    },
];
