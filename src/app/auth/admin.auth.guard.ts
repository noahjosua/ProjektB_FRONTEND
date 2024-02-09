import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree }  from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AdminAuthGuard implements CanActivate {
    
    constructor(private authService: AuthService, private router: Router) {}

    // Method to determine whether the user is allowed to activate the route
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // Check if the user is authenticated
        const isAuth = this.authService.getIsAuth();
        // Check if the user is an administrator
        const isAdmin = this.authService.getIsAdmin();
        // If the user is not authenticated or not an administrator, navigate to the login page
        if(!isAuth && !isAdmin || !isAdmin) {
            this.router.navigate(['/login']);
        } 
        // Return true if the user is an administrator, allowing the route activation
        return isAdmin;
    }
}