import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree }  from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
    
    constructor(private authService: AuthService, private router: Router) {}

    // Method to determine whether the user is allowed to activate the route
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // Check if the user is authenticated
        const isAuth = this.authService.getIsAuth();
        // If the user is not authenticated, navigate to the login page
        if(!isAuth) {
            this.router.navigate(['/login']);
        } 
        // Return whether the user is authenticated
        return isAuth;
    }
}