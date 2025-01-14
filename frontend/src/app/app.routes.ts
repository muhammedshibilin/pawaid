import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/error/not-found/not-found.component';
import { LoginComponent } from './components/common/login/login.component';
import { preventAuthGuard } from './core/guards/prevent-auth.guard';
import { RegisterComponent } from './components/common/register/register.component';
import { VerifyEmailComponent } from './components/common/verify-email/verify-email.component';
import { OtpComponent } from './components/common/otp/otp.component';

export const routes: Routes = [
  { 
    path: 'admin', 
    loadChildren: () => import('./components/admin/admin.module')
      .then(m => m.AdminModule)
  },
  { 
    path: '', 
    loadChildren: () => import('./components/user/user.module')
      .then(m => m.UserModule)
  },
  {path:'login',component:LoginComponent,canActivate:[preventAuthGuard]},
  {path:'register',component:RegisterComponent,canActivate:[preventAuthGuard]},
  {path:'verify-email',component:VerifyEmailComponent},
  {path:'otp',component:OtpComponent},
  {path:'404',component: NotFoundComponent},
  {path: '**',redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
