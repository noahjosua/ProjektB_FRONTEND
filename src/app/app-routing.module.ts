import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { StudentProjectDetailComponent } from './student-project-detail/student-project-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminAuthGuard } from './auth/admin.auth.guard';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    { path: '', component: LandingpageComponent },
    { path: 'details/:projectId', component: StudentProjectDetailComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent, canActivate: [AuthGuard, AdminAuthGuard] },
    { path: 'profile/:creatorId', component: ProfileComponent, canActivate: [AuthGuard]}
]; 

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard, AdminAuthGuard]
})
export class AppRoutingModule {


}