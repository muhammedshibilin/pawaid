import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GoogleService } from '../../../core/services/all/google.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { AdminService } from '../../../core/services/admin/admin.service';

interface PathMap {
  [key: string]: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  user: any = null;
  showPassword = false;
  selectedUserType = 'User';
  userTypes = ['User', 'Admin', 'Doctor', 'Recruiter'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private googleService: GoogleService,
    private adminService:AdminService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.googleService.user$.subscribe((user) => (this.user = user));
  }

  getUserTypeIcon(type: string): string {
    const icons = {
      'User': 'fa-user',
      'Admin': 'fa-user-shield',
      'Doctor': 'fa-user-md',
      'Recruiter': 'fa-user-tie'
    };
    return icons[type as keyof typeof icons] || 'fa-user';
  }

  selectUserType(type: string): void {
    this.selectedUserType = type;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  signInWithGoogle() {
    this.googleService.signInWithGoogle()
      .then(() => {
        // The success handling is now done in the GoogleService
      })
      .catch((error) => {
        console.error('Sign-in error:', error);
        this.toastr.error('Google sign-in failed. Please try again.', 'Error');
      });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = {
        ...this.loginForm.value};

      const loginObserver = {
        next: (response: any) => {
          console.log('haiii responsee is ',response)
        if(response.status==201){
          console.log('user not verifiedd')
          const toast = this.toastr.error(response.message, 'error', {
            timeOut: 2000,
            progressBar: true
          });
          toast.onHidden.subscribe(() => {
            localStorage.setItem('user_id',response.data._id)
            this.router.navigate(['/otp'])
          })
          return
        }


          console.log('Login Successful', response);
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('userType', this.selectedUserType.toLowerCase());
          const toast = this.toastr.success(response.message, 'Success', {
            timeOut: 2000,
            progressBar: true
          });
          toast.onHidden.subscribe(() => {
            this.router.navigate([this.getRedirectPath()]);
          });
        },
        error: (error: any) => {
          console.error('Login Failed', error);
          const errorMessage = error.error?.message || 'Login failed. Please try again.';
          this.toastr.error(errorMessage, 'Error');
        },
      };

      if (this.selectedUserType === 'User') {
        this.userService.login(loginData).subscribe(loginObserver);
      } else if (this.selectedUserType === 'Admin') {
        this.adminService.login(loginData).subscribe(loginObserver);
      }
    } else {
      this.toastr.warning('Please fill in all fields correctly.', 'Warning');
    }
  }

  getRedirectPath(): string {
    const userType = this.selectedUserType.toLowerCase();
    switch (userType) {
      case 'user':
        return '/';
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/';
      case 'recruiter':
        return '/';
      default:
        return '/';
    }
  }

  navigateToRegister(){
    this.router.navigate(['/register'])
  }

  navigateToVerifyEmail() {
    this.router.navigate(['/verify-email']);
  }
}
