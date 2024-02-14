import { Component, OnInit } from '@angular/core';
import { Project } from '../project.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProjectService } from '../project.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { NotificationMessage } from '../NotificationMessage';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-student-project-detail',
  templateUrl: './student-project-detail.component.html',
  styleUrls: ['./student-project-detail.component.css']
})
export class StudentProjectDetailComponent implements OnInit {

  private projectId: string; 
  private authListenerSub: Subscription; 
  private showMessageToUserSub: Subscription;
  private notification: NotificationMessage = { severity: '', summary: '', detail: '' };

  project: Project; 
  sanitizedDescription: SafeHtml;
  isAuthenticated: boolean = false; 
  userId: string; 
  isAdmin: boolean;
  isSmallScreen: boolean;

  isEditing: boolean = false;
  uploadedFiles: File[] = [];
  uploadURL = `${environment.baseUrl}/api/projects/upload`; 

  updatedProject: Project = { 
    id: '',
    title: '',
    start: new Date(), 
    end: new Date(), 
    team: [],
    techStack: [],
    repositoryUrl: '',
    description: '',
    imagesPaths: [],
    creator: ''
  }
  
  isValidTitle: boolean = true; 
  isValidStart: boolean = true;
  isValidEnd: boolean = true;
  isValidTeam: boolean = true;
  isValidTechStack: boolean = true;
  isValidRepositoryUrl: boolean = true;
  isValidDescription: boolean = true;

    // Quill editor modules for description
    quillModules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // basic formatting
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],   // lists
        ['link']                                         // link 
      ]
    };

  constructor(
    public route: ActivatedRoute, 
    public projectService: ProjectService, 
    private authService: AuthService, 
    private messageService: MessageService, 
    private responsive: BreakpointObserver, 
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.isAdmin = this.authService.getIsAdmin();
    this.isAuthenticated = this.authService.getIsAuth();

    this.authListenerSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
      this.isAdmin = this.authService.getIsAdmin();
    });

    this.showMessageToUserSub = this.projectService.getShowMessageToUserSubject().subscribe(
      message => {
        this.notification = message;
      }
    );

    this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(
      result => {
        if(result.matches) this.isSmallScreen = true;
      }
    );

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('projectId')) {
        this.projectId = paramMap.get('projectId');
        this.projectService.getProject(this.projectId).subscribe(projectData => {
          this.project = {
            id: projectData._id,
            title: projectData.title,
            start: projectData.start,
            end: projectData.end,
            team: [projectData.team],
            techStack: [projectData.techStack],
            repositoryUrl: projectData.repositoryUrl,
            description: projectData.description,
            imagesPaths: [projectData.imagesPaths],
            creator: projectData.creator
          }; 
          this.sanitizedDescription = this.sanitizer.bypassSecurityTrustHtml(this.project.description);
        });
      }
    });
  }

  formatDate(projectDate: string) {
    if(projectDate !== undefined && projectDate !== null) {
      const date = new Date(projectDate);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString();
      return `${month}/${year}`;
    }
  }

  formatArrayValues(values: string[]) {
    if(values !== undefined && values !== null) {
      return values.join(', ');
    }
  }

  formatImagePaths(imagesPaths: string[]) {
    if(imagesPaths !== undefined && imagesPaths !== null) {
      const pathsArray = imagesPaths[0]; 
      const urls: string[] = [];
      for(const path of pathsArray) {
        urls.push(path);
      }
      return urls.map(source => ({source}));
    }
  }

  onDelete(projectId: string) {
    this.projectService.deleteProject(projectId);
    setTimeout(() => {
      this.messageService.add(this.notification);
    }, 1000);
  }

  onEdit() {
    this.isEditing = true;
    this.updatedProject = {
      id: this.project.id,
      title: this.project.title,
      start: new Date(),
      end: new Date(),
      team: this.project.team,
      techStack: this.project.techStack,
      repositoryUrl: this.project.repositoryUrl,
      description: this.project.description,
      imagesPaths: this.project.imagesPaths,
      creator: this.project.creator
    }
  }

  validateTitel() {
    this.isValidTitle = this.updatedProject.title.length > 0 && this.updatedProject.title.length <= 50;
  }

  validateDate() {
    this.isValidStart = this.updatedProject.start <= new Date() && this.updatedProject.start <= this.updatedProject.end;
    this.isValidEnd = this.updatedProject.end >= this.updatedProject.start;
  }

  validateTeam() {
    this.isValidTeam = this.updatedProject.team.length > 0;
  }

  validateTechStack() {
    this.isValidTechStack = this.updatedProject.techStack.length > 0;
  }

  validateRepositoryUrl() {
    const regex = /https:\/\/(?:www\.)?(?:[\da-zA-Z-]+\.){1,2}[a-zA-Z]{2,6}(?:\/[^\s]*)?/;
    this.isValidRepositoryUrl = regex.test(this.updatedProject.repositoryUrl);     
  }

  validateDescription() {
    this.isValidDescription = this.updatedProject.description.length > 0;
  }

  onUpload(event) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  }

  saveProject() {
    this.isEditing = false;
    this.projectService.updateProject(this.updatedProject, this.uploadedFiles);
    setTimeout(() => {
      this.messageService.add(this.notification);
    }, 1000);
    this.clearUpdatedProject();
    this.clearValidation();
  }

  shortenString(input: string) {
    if(input.length > 10) {
      return input.substring(0, 10) + '...';
    } else {
      return input;
    }
  }

  cancel() {
    this.isEditing = false;
    this.clearUpdatedProject();
    this.clearValidation();
  }

  private clearUpdatedProject() {
    this.updatedProject = { 
      id: '',
      title: '',
      start: new Date(), 
      end: new Date(), 
      team: [],
      techStack: [],
      repositoryUrl: '',
      description: '',
      imagesPaths: [],
      creator: ''
    }
    this.uploadedFiles = [];
  }

  private clearValidation() {
    this.isValidTitle = true; 
    this.isValidStart = true;
    this.isValidEnd = true;
    this.isValidTeam = true;
    this.isValidTechStack = true;
    this.isValidRepositoryUrl = true;
    this.isValidDescription = true;
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe(); 
    this.showMessageToUserSub.unsubscribe(); 
  }
}