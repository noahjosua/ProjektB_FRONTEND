import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project } from '../../project.model';
import { ProjectService } from '../../project.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-student-projects',
  templateUrl: './student-projects.component.html',
  styleUrls: ['./student-projects.component.css']
})
export class StudentProjectsComponent implements OnInit, OnDestroy {
  
  private authListenerSub: Subscription; 
  private projectsSub: Subscription;
  private defaultImage: File; 

  // Authentication status and project data
  isAuthenticated: boolean = false; 
  projects: any [] = [];  

  // Responsive design check for small screens
  isSmallScreen: boolean;
  
  // Project creation variables
  isCreating: boolean = false;
  newProject: Project = { 
    title: '',
    start: new Date(), 
    end: new Date(), 
    team: [],
    techStack: [],
    repositoryUrl: '',
    description: '',
    creator: ''
  }
  uploadedFiles: File[] = [];
  uploadURL = `${environment.baseUrl}/api/projects/upload`; 
  
  // Validation flags for form inputs
  isValidTitle: boolean = false; 
  isValidStart: boolean = false;
  isValidEnd: boolean = false;
  isValidTeam: boolean = false;
  isValidTechStack: boolean = false;
  isValidRepositoryUrl: boolean = true;
  isValidDescription: boolean = false;

  // Quill editor modules for description
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // basic formatting
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],   // lists
      ['link']                                         // link 
    ]
  };

  constructor(public projectService: ProjectService, private authService: AuthService,  private responsive: BreakpointObserver) { }

  ngOnInit(): void {
    // Fetch projects on component initialization
    this.projectService.fetchProjects();

    // Subscribe to project updates
    this.projectsSub = this.projectService.getProjectUpdateListener().subscribe((projects: Project[]) => {
      this.projects = projects;
    }); 

    // Get authentication status and subscribe to changes
    this.isAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });

    // Load default image for project creation
    this.loadDefaultImage();

    // Check for small screens using BreakpointObserver
    this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(
      result => {
        if(result.matches) this.isSmallScreen = true;
      }
    );
  }

  // Method to initiate project creation
  createProject() { this.isCreating = true; }

  // Validation methods for form inputs
  validateTitel() {
    this.isValidTitle = this.newProject.title.length > 0 && this.newProject.title.length <= 50;
  }

  validateDate() {
    this.isValidStart = this.newProject.start <= new Date() && this.newProject.start <= this.newProject.end;
    this.isValidEnd = this.newProject.end >= this.newProject.start;
  }

  validateTeam() {
    this.isValidTeam = this.newProject.team.length > 0;
  }

  validateTechStack() {
    this.isValidTechStack = this.newProject.techStack.length > 0;
  }

  validateRepositoryUrl() {
    const regex = /https:\/\/(?:www\.)?(?:[\da-zA-Z-]+\.){1,2}[a-zA-Z]{2,6}(?:\/[^\s]*)?/;
    this.isValidRepositoryUrl = regex.test(this.newProject.repositoryUrl);     
  }

  validateDescription() {
    this.isValidDescription = this.newProject.description.length > 0;
  }

  // Method to handle file uploads
  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  // Method to save the project
  saveProject() {
    this.isCreating = false;

    // If no images uploaded, use default image
    if(this.uploadedFiles.length == 0) {
      this.uploadedFiles.push(this.defaultImage);
    }

    // Add project using ProjectService
    this.projectService.addProject(this.newProject, this.uploadedFiles);

    // Clear form inputs and validations
    this.clearNewProject();
    this.clearValidation();
  }

  // Method to shorten strings for display
  shortenString(input: string) {
    let inputToDisplay = input.replace(/<[^>]*>/g, '');
    if(inputToDisplay.length > 100) {
      return inputToDisplay.substring(0, 100) + '...';
    } else {
      return inputToDisplay;
    }
  }

  // Method to load default image for project creation
  private loadDefaultImage() {
    const url = '../../../assets/pictures/default.png';
    const fileName = 'default.png';

    fetch(url)
      .then((response) => response.blob())
        .then((blob) => {
          this.defaultImage = new File([blob], fileName, { type: blob.type });
        })
        .catch((error) => {});
  }

  // Method to cancel project creation
  cancel() {
    this.isCreating = false;
    this.clearNewProject();
    this.clearValidation();
  }

  // Private method to clear the new project form inputs
  private clearNewProject() {
    this.newProject = { 
      title: '',
      start: new Date(), 
      end: new Date(), 
      team: [],
      techStack: [],
      repositoryUrl: '',
      description: '',
      creator: ''
    }
    this.uploadedFiles = [];
  }

  // Private method to clear validation flags for form inputs
  private clearValidation() {
    this.isValidTitle = false; 
    this.isValidStart = false;
    this.isValidEnd = false;
    this.isValidTeam = false;
    this.isValidTechStack = false;
    this.isValidRepositoryUrl = true;
    this.isValidDescription = false;
  }

  // OnDestroy lifecycle hook to unsubscribe from subscriptions
  ngOnDestroy(): void {
    this.projectsSub.unsubscribe(); 
    this.authListenerSub.unsubscribe(); 
  }
}