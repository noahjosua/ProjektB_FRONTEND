import { Component, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription; // Subscription for authentication status changes
  // Authentication and admin status
  private isAuthenticated: boolean; 
  private isAdmin: boolean;
  options: MenuItem[]; // Menu options for the toolbar
  routerLink: string; // Router link for navigation
  isSmallScreen: boolean; // Flag for small screens

  constructor(private authService: AuthService, private responsive: BreakpointObserver) { 
    // Initialize admin status and update options
    this.isAdmin = this.authService.getIsAdmin();
    this.updateOptions();
  }

  ngOnInit(): void {
    // Retrieve initial authentication and admin status
    this.isAuthenticated = this.authService.getIsAuth();
    this.isAdmin = this.authService.getIsAdmin();

    // Update options based on authentication and admin status
    this.updateOptions();

    // Subscribe to authentication status changes
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        this.isAdmin = this.authService.getIsAdmin();
        // Update options when authentication status changes
        this.updateOptions();
      });

      // Observe screen size changes
      this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(
        result => {
          // Update isSmallScreen flag based on screen size
          if(result.matches) {
            this.isSmallScreen = true;
            this.modifyOptionsForSmallerScreen(); // Modify options for smaller screens
          }
        }
      )
  }

  // Update menu options based on authentication and admin status
  private updateOptions() {
    if(this.isAuthenticated && !this.isAdmin) {
      this.options = [
        {
          label: 'Profil',
          command: () => { this.onProfile(); }
        },
        {
          label: 'Logout',
          command: () => { this.onLogout(); }
        }
      ];
    }
    else if(this.isAuthenticated && this.isAdmin) {
      this.options = [
        {
          label: 'Profil',
          command: () => { this.onProfile(); }
        },
        {
          label: 'Neuer User',
          command: () => { this.onSignup(); }
        },
        {
          label: 'Logout',
          command: () => { this.onLogout(); }
        }
      ];
    }
    else {
      this.options = [
        {
          label: 'Login', 
          command: () => { this.onLogin(); }
        }
      ];
    }
  }

  // Modify options for smaller screens by adding navigation links
  private modifyOptionsForSmallerScreen() {
    this.options.unshift(
      {
        label: 'Startseite',
        command: () => { this.routerLink = '/'; }
      },
      {
        label: 'Über',
        command: () => { window.location.href = '#about'; }
      },
      {
        label: 'Projekte',
        command: () => { window.location.href = '#projects'; }
      }
    );
  }

  private onLogin() {
    this.routerLink = '/login';
  }

  private onLogout() {
    this.authService.logout();
  }

  private onProfile() {
    this.routerLink = '/profile/' + this.authService.getUserId();
  }

  private onSignup() {
    this.routerLink = '/signup';
  }

  toggleView() {
    if(this.isAuthenticated) this.onProfile(); 
    else this.onLogin();
  }

  ngOnDestroy(): void {
    // Unsubscribe from authentication status changes
    this.authListenerSubs.unsubscribe();
  }
}
