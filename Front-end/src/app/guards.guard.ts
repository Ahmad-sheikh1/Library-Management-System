import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './store/counter.state';
import { selectLoginData } from './store/counter.selector';
import { map, Observable } from 'rxjs';

export const guardsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => { 
  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.select(selectLoginData).pipe(
    map(loginData => {
      if (loginData?.LoginData && Object.keys(loginData.LoginData).length > 0) {
        console.log(loginData.LoginData);
        
        return true;  // Allow access if logged in
      } else {
        router.navigateByUrl('Login'); // Redirect to login if not logged in
        return false;  // Deny access
      }
    })
  );
};
