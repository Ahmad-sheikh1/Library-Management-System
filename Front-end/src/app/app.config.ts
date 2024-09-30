import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { LoginReducer, reducer } from './store/counter.reducers';


export const appConfig: ApplicationConfig = {
  providers: [provideStore(),
  provideState('AllBooks', reducer),
  provideState('LoginData', LoginReducer), provideHttpClient(),
  provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideStore()]
};
