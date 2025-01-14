// navbar.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import '@fortawesome/fontawesome-free/css/all.css';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  logoPath = 'assets/user/images/logo.png';
  currentRoute: string = '';
  isNavbarVisible = false;
  hideTimeout: any;
  
  navbarItems = [
    { icon: 'fa-home', text: 'Home', link: '/' },
    { icon: 'fa-envelope', text: 'Messages', link: '/messages' },
    { icon: 'fa-user', text: 'Profile', link: '/profile' },
    { icon: 'fa-hand-holding-heart', text: 'Donate', link: '/donate' },
  ];

  constructor(private router: Router) {}

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const windowHeight = window.innerHeight;
    const threshold = windowHeight - 100;
    
    if (event.clientY > threshold) {
      // Clear any existing timeout when mouse moves into the zone
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
      this.isNavbarVisible = true;
    } else {
      // Set a timeout to hide the navbar after 1 second
      if (!this.hideTimeout) {
        this.hideTimeout = setTimeout(() => {
          this.isNavbarVisible = false;
          this.hideTimeout = null;
        }, 1000); // 1 second delay
      }
    }
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
  }

  shouldShowItem(item: any): boolean {
    if (item.text === 'Home' && this.currentRoute === '/') {
      return false;
    }
    if (item.text === 'Profile' && this.currentRoute === '/profile') {
      return false;
    }
    if(item.text==='Donate' && this.currentRoute === '/donate'){
      return false;
    }
    return true;
  }
}