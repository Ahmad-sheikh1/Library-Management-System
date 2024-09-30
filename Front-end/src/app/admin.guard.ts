import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './store/counter.state';  // Adjust the path according to your structure
import { selectLoginData } from './store/counter.selector';  // Adjust the path according to your structure
import { map, Observable } from 'rxjs';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => { 
  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.select(selectLoginData).pipe(
    map(loginData => {
      if (loginData?.LoginData && loginData.LoginData.length > 0) {
        // Access the first user in the LoginData array
        const user = loginData.LoginData[0];
        // Check if the role is admin
        if (user.role === 'admin') {
          return true;  // Allow access if the user is an admin
        } else {
          router.navigateByUrl('not-authorized'); // Redirect to not authorized page
          return false;  // Deny access
        }
      } else {
        router.navigateByUrl('Login'); // Redirect to login if not logged in
        return false;  // Deny access
      }
    })
  );
};
