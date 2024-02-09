import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { Subject } from 'rxjs';
import { Router } from "@angular/router";
import { NotificationMessage } from "../NotificationMessage";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class AuthService {

    // Private variables to manage authentication state, token, and user information
    private isAuthenticated = false;
    private token: string;
    private authStatusListener = new Subject<boolean>();
    private showMessageToUserSubject = new Subject<NotificationMessage>();
    private tokenTimer: NodeJS.Timeout;
    private userId: string; 
    private isAdmin: boolean;

    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getIsAdmin() {
        return this.isAdmin;
    }

    // Getter method to subscribe to authentication status changes
    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    // Getter method to subscribe to messages to be shown to the user
    getShowMessageToUserSubject() {
        return this.showMessageToUserSubject.asObservable();
    }

    // Method to create a new user
    createUser(email: string, password: string, isAdmin: boolean) {
        const authData: AuthData = { email: email, password: password, isAdmin: isAdmin };
        this.http.post(`${environment.baseUrl}/api/user/signup`, authData) 
            .subscribe(() => {  
                // Show success message and navigate to the home page after a delay
                this.showMessageToUserSubject.next({ severity: 'success', summary: 'Erfolg', detail: 'Neuer User angelegt' });
                setTimeout(() => {
                    this.router.navigate(['/']);
                  }, 3000);
            },
            error => {
                // Show appropriate error message based on the response status
                if(error.status == 401) this.showMessageToUserSubject.next({ severity: 'error', summary: 'Fehler', detail: 'Bitte erneut anmelden' });
                else this.showMessageToUserSubject.next({ severity: 'error', summary: 'Fehler', detail: 'Registrierung fehlgeschlagen - Email bereits vergeben' });
            });
    }

    // Method to handle user login
    login(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        this.http.post<{ token: string, expiresIn: number, userId: string, isAdmin: boolean }>(`${environment.baseUrl}/api/user/login`, authData) 
            .subscribe(response => {
                // Process login response and set authentication state
                this.token = response.token;
                if(this.token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.isAdmin = response.isAdmin;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(this.token, expirationDate, this.userId, this.isAdmin);
                    // Show success message and navigate to the home page after a delay
                    this.showMessageToUserSubject.next({ severity: 'success', summary: 'Erfolg', detail: 'Login erfolgreich' });
                    setTimeout(() => {
                        this.router.navigate(['/']);
                      }, 3000);
                }
            },
            error => {
                // Handle login error, set authentication state, and show error message
                this.authStatusListener.next(false);
                this.showMessageToUserSubject.next({ severity: 'error', summary: 'Fehler', detail: 'Email oder Passwort falsch' });
            });
    }

    // Method to automatically authenticate the user on page reload
    autoAuthUser() {
        const authInformation = this.getAuthData();
        if(!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0) {
            // Restore authentication state, user information, and set authentication timer
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            if(authInformation.isAdmin == 'true') this.isAdmin = true;
            else this.isAdmin = false;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    // Method to handle user logout
    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = null;
        this.isAdmin = false;
        this.router.navigate(['/']);
    }

    // Private method to save authentication data to local storage
    private saveAuthData(token: string, expirationDate: Date, userId: string, isAdmin: boolean) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('userId', userId);
        localStorage.setItem('isAdmin', isAdmin.toString());
    }

    // Private method to clear authentication data from local storage
    private clearAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAdmin');
    }

    // Private method to retrieve authentication data from local storage
    private getAuthData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        const isAdmin = localStorage.getItem('isAdmin');
        // Check if token and expiration date exist in local storage
        if(!token || !expirationDate) {
            return;
        }
        // Return an object with authentication data
        return { token: token, expirationDate: new Date(expirationDate), userId: userId, isAdmin: isAdmin };
    }

    // Private method to set a timer for automatic logout after a specified duration
    private setAuthTimer(duration: number) {
        // Set a timer to invoke the logout method after the specified duration
        this.tokenTimer = setTimeout(() => {
            this.logout();
          }, duration * 1000);
    }
}