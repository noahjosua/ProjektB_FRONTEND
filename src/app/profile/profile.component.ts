import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from '../project.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProjectService } from '../project.service';
import { AuthService } from '../auth/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  private authListenerSub: Subscription; // Subscription to listen for authentication changes
  private projectsSub: Subscription; // Subscription to listen for project updates
  isAuthenticated: boolean = false; // Flag to indicate whether the user is authenticated
  projects: any [] = []; // Array to store projects associated with the profile
  isSmallScreen: boolean; // Flag to indicate if the screen is small
  private creatorId: string; // ID of the creator (profile owner)

  constructor(
    public route: ActivatedRoute, 
    public projectService: ProjectService, 
    private authService: AuthService,  
    private responsive: BreakpointObserver) { }

  ngOnInit(): void {
    // Check authentication status
    this.isAuthenticated = this.authService.getIsAuth();
    // Subscribe to authentication status changes
    this.authListenerSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });

    // Subscribe to route parameter changes
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('creatorId')) {
        // Get creatorId from the route parameters
        this.creatorId = paramMap.get('creatorId');
        // Fetch projects associated with the creatorId
        this.projectService.fetchProjectsByCreator(this.creatorId);

        // Subscribe to project updates
        this.projectsSub = this.projectService.getProjectUpdateListener().subscribe((projects: Project[]) => {
          this.projects = projects;
        }); 
      }
    });

    // Observe screen size changes for responsiveness
    this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(
      result => {
        if(result.matches) this.isSmallScreen = true;
      }
    );
  }

  // Method to shorten a given string
  shortenString(input: string) {
    let inputToDisplay = input.replace(/<[^>]*>/g, '');
    if(inputToDisplay.length > 100) {
      return inputToDisplay.substring(0, 100) + '...';
    } else {
      return inputToDisplay;
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from the authentication status changes and the project updates
    this.authListenerSub.unsubscribe();
    this.projectsSub.unsubscribe();
  }
}
