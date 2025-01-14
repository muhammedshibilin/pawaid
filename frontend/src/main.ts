import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import  {routes} from '../src/app/app.routes'
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { blockCheckInterceptor } from './app/core/interceptors/block-check.interceptor';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { environment } from './environments/environment';



export function tokenGetter() {
  return localStorage.getItem('accessToken');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([blockCheckInterceptor,authInterceptor])),
    CookieService,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    JwtHelperService,
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      progressAnimation: 'increasing',
    }),
    {
      provide: JWT_OPTIONS,
      useValue: {
        tokenGetter:() => localStorage.getItem('accessToken'),
        allowedDomains: ['localhost:4040'],  
        disallowedRoutes: []
      }
    },
    provideAnimations(), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
}).catch(err => console.error(err));
