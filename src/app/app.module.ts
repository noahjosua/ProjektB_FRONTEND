import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ChipsModule } from 'primeng/chips';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { GalleriaModule } from 'primeng/galleria';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { EditorModule } from 'primeng/editor';
import { DividerModule } from 'primeng/divider';

import { AppComponent } from './app.component';
import { AboutComponent } from './landingpage/about/about.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { StudentProjectsComponent } from './landingpage/student-projects/student-projects.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { StudentProjectDetailComponent } from './student-project-detail/student-project-detail.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    StudentProjectsComponent,
    ToolbarComponent,
    StudentProjectDetailComponent,
    LandingpageComponent,
    ProfileComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ToolbarModule,
    ButtonModule, 
    DialogModule,
    BrowserAnimationsModule,
    CalendarModule,
    HttpClientModule,
    ChipsModule,
    FileUploadModule,
    InputTextModule,
    PasswordModule,
    SplitButtonModule,
    CheckboxModule,
    GalleriaModule,
    ScrollTopModule,
    ScrollPanelModule,
    ToastModule,
    EditorModule,
    DividerModule
  ],
  providers: [
    MessageService, 
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
