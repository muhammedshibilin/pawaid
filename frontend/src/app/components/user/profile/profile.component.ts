import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { Router } from '@angular/router';

interface Notification {
  id: number;
  title: string;
  time: Date;
  icon: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  showNotifications = false;
  notifications: Notification[] = [
    {
      id: 1,
      title: 'Your donation was successful',
      time: new Date(),
      icon: 'fa-gift'
    },
    {
      id: 2,
      title: 'Profile updated successfully',
      time: new Date(Date.now() - 3600000),
      icon: 'fa-user-edit'
    },
    {
      id: 3,
      title: 'Welcome to our platform!',
      time: new Date(Date.now() - 7200000),
      icon: 'fa-star'
    }
  ];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Profile component initialized');
    this.getProfile();
  }

  getProfile() {
    console.log('Fetching profile data');
    this.userService.getProfile().subscribe({
      next: (response) => {
        console.log('Profile data received:', response);
        this.profile = response.data;
        this.toastr.success('Profile fetched successfully!', 'Success');
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        this.toastr.error(err.error.message || 'Failed to fetch profile', 'Error');
      },
    });
  }

  toggleNotifications(): void {
    console.log('Toggling notifications');
    this.showNotifications = !this.showNotifications;
  }

  logout(): void {
    console.log('Logging out');
    this.userService.logout().subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        localStorage.removeItem('accessToken');
        this.toastr.success(response.message, 'Success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error during logout:', err);
      },
    });
  }
}
