import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { NotificationMessage } from '../../NotificationMessage';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  // Properties for storing email, password, and notification message
  email = '';
  password = '';
  private notification: NotificationMessage = { severity: '', summary: '', detail: '' };

  // Properties for storing subscriptions
  private authStatusSub: Subscription;
  private showMessageToUserSub: Subscription;
  
  // Constructor with dependency injection of AuthService and MessageService
  constructor(public authService: AuthService, private messageService: MessageService) {}

  ngOnInit(): void {
    // Subscribe to authentication status changes
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        // Logic for handling authentication status changes can be added here
      }
    ); 

    // Subscribe to messages to be shown to the user
    this.showMessageToUserSub = this.authService.getShowMessageToUserSubject().subscribe(
      message => { this.notification = message; }
    );
  }

  // Method triggered when the login button is clicked
  onLogin() {
    // Call the login method of the AuthService with provided email and password
    this.authService.login(this.email, this.password);
    // Display a notification message after a delay of 1 second
    setTimeout(() => {
      this.messageService.add(this.notification);
    }, 1000);
  }

  ngOnDestroy(): void {
    // Unsubscribe from the authentication status and message subscriptions
    this.authStatusSub.unsubscribe();
    this.showMessageToUserSub.unsubscribe();
  }
}