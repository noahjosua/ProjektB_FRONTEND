import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { NotificationMessage } from '../../NotificationMessage';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  // Private subscriptions for authentication status and user message
  private authStatusSub: Subscription;
  private showMessageToUserSub: Subscription;

  // Private properties for storing notification, email pattern and password pattern
  private notification: NotificationMessage = { severity: '', summary: '', detail: '' };
  private emailPattern = '^[A-Za-z0-9._%+-]+@haw-hamburg\\.de$';
  private passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})';

  // Properties for storing error messages
  emailError = 'Bitte geben Sie eine gültige HAW E-Mail-Adresse ein.';
  passwordError = 'Mind. 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Zahl und 8 Zeichen lang.';
  passwordRepeatError = 'Die Passwörter stimmen nicht überein.';

  // Properties for storing email, password, repeated password and isAdmin status
  email = '';
  password = '';
  repeatPassword = '';
  isAdmin = false;
  
  // CSS classes for form input styling (dynamic class binding angular)
  emailVal = '';
  passwordVal = '';
  repeatPasswordVal = '';
  
  // Flags indicating the validity of email, password, and repeat password
  isValidEmail = false;
  isValidPassword = false;
  isValidRepeatPassword = false;

  // Flags indicating whether to display error messages for email, password, and repeat password
  showEmailError = false;
  showPasswordError = false;
  showRepeatPasswordError = false;

  constructor(public authService: AuthService, private messageService: MessageService) { }

  ngOnInit(): void {
    // Subscribe to authentication status changes
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => { }
    );
    // Subscribe to messages to be shown to the user
    this.showMessageToUserSub = this.authService.getShowMessageToUserSubject().subscribe(
      message => { this.notification = message; }
    );
  }

  // Method to validate the email input
  validateEmail(): boolean {
    if (this.email === '' || this.email === null || this.email === undefined || !this.email.match(this.emailPattern)) {
      this.emailVal = 'ng-invalid ng-dirty';
      this.isValidEmail = false;
      this.showEmailError = true;
      return false;
    }
    this.emailVal = '';
    this.isValidEmail = true;
    this.showEmailError = false;
    return true;
  }

  // Method to validate the password input
  validatePassword(): boolean {
    if (this.password === '' || this.password === null || this.password === undefined || !this.password.match(this.passwordPattern)) {
      this.passwordVal = 'ng-invalid ng-dirty';
      this.isValidPassword = false;
      this.showPasswordError = true;
      return false;
    }
    this.passwordVal = '';
    this.isValidPassword = true;
    this.showPasswordError = false;
    return true;
  }

  // Method to validate the repeated password input
  validateRepeatPassword(): boolean {
    if (this.repeatPassword === '' || this.repeatPassword === null || this.repeatPassword === undefined || !this.repeatPassword.match(this.passwordPattern) || this.repeatPassword !== this.password) {
      this.repeatPasswordVal = 'ng-invalid ng-dirty';
      this.isValidRepeatPassword = false;
      this.showRepeatPasswordError = true;
      return false;
    }
    this.repeatPasswordVal = '';
    this.isValidRepeatPassword = true;
    this.showRepeatPasswordError = false;
    return true;
  }

  // Method triggered when the signup button is clicked
  onSignUp() {
    // Validate email, password, and repeat password before attempting to create a user
    if (this.validateEmail() && this.validatePassword() && this.validateRepeatPassword()) {
      // Call the createUser method of the AuthService with provided data
      this.authService.createUser(this.email, this.password, this.isAdmin);

      // Display a notification message after a delay
      setTimeout(() => {
        this.messageService.add(this.notification);
      }, 1000);

      // Reset form input values and validation states
      this.resetValidation();
    }
  }

  // Private method to reset form input values and validation states
  private resetValidation(): void {
    this.email = '';
    this.password = '';
    this.repeatPassword = '';
    this.isAdmin = false;
    this.emailVal = '';
    this.passwordVal = '';
    this.repeatPasswordVal = '';
    this.isValidEmail = false;
    this.isValidPassword = false;
    this.isValidRepeatPassword = false;
    this.showEmailError = false;
    this.showPasswordError = false;
    this.showRepeatPasswordError = false;
  }

  ngOnDestroy(): void {
    // Unsubscribe from the authentication status and message subscriptions
    this.authStatusSub.unsubscribe();
    this.showMessageToUserSub.unsubscribe();
  }
}