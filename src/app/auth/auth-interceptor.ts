import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    // Intercept method to modify outgoing HTTP requests by adding an Authorization header with the token
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // Get the authentication token from the AuthService
        const authToken = this.authService.getToken();
        // Clone the original request and add the Authorization header with the token
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authToken)
        }); 
        // Pass the modified request to the next handler in the chain
        return next.handle(authRequest);
    }
}