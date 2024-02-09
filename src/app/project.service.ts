import { Injectable } from '@angular/core';
import { Project } from './project.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { NotificationMessage } from './NotificationMessage';
import { environment } from '../environments/environment';

@Injectable({providedIn: 'root'})
export class ProjectService {
    private projects: Project[] = []; // Array to store all projects
    private userProjects: Project[] = []; // Array to store projects specific to the logged-in user
    private projectsUpdated = new Subject<Project[]>(); // Subject to notify subscribers about project updates
    private showMessageToUserSubject = new Subject<NotificationMessage>(); // Subject to notify subscribers about messages to be shown to the user
    
    constructor(private httpClient: HttpClient, private router: Router) {}

    // Observable for messages to be shown to the user
    getShowMessageToUserSubject() {
        return this.showMessageToUserSubject.asObservable();
    }

    // Observable for project updates
    getProjectUpdateListener() {
        return this.projectsUpdated.asObservable();
    }

    // Fetch all projects from the backend
    fetchProjects() {
        this.httpClient.get<{message: string, projects: any }>(`${environment.baseUrl}/api/projects/`) 
            .pipe(map(projectData => {  	        
                return projectData.projects.map(project => {
                    return {
                        id: project._id,
                        title: project.title,
                        start: project.start,
                        end: project.end,
                        team: project.team,
                        techStack: project.techStack,
                        repositoryUrl: project.repositoryUrl,
                        description: project.description,
                        imagesPaths: project.imagesPaths,
                        creator: project.creator
                    };
                });
            }))
            .subscribe((transformedProjects) => {
                this.projects = transformedProjects;
                this.projectsUpdated.next([...this.projects]);
            });
    }

    // Fetch projects by creator from the backend
    fetchProjectsByCreator(creatorId: string) {
        return this.httpClient.get<{ projects: Project[] }>
        (`${environment.baseUrl}/api/projects/creator/` + creatorId) 
            .subscribe((projectData) => {
                this.userProjects = projectData.projects;
                this.projectsUpdated.next([...this.userProjects]);
            }
        );
    }

    // Fetch a single project by ID from the backend
    getProject(id: string) {
        return this.httpClient.get<{_id: string, title: string, start: Date, end: Date, team: string, techStack: string, repositoryUrl: string, description: string, imagesPaths: string, creator: string }>
        (`${environment.baseUrl}/api/projects/` + id); 
    }

    // Add a new project to the backend
    addProject(project: Project, images: File[]) {
        const projectData = new FormData();
        projectData.append('project', JSON.stringify(project));
        for(let i = 0; i < images.length; i++) {
            projectData.append('images', images[i], images[i].name);
        }   
        this.httpClient.post<{ message: string, project: Project }>(`${environment.baseUrl}/api/projects/`, projectData) 
            .subscribe((responseData) => {
                project.id = responseData.project.id; 
                project.imagesPaths = responseData.project.imagesPaths;
                this.projects.push(project);
                this.projectsUpdated.next([...this.projects]);
        }); 
    }

    // Update an existing project in the backend
    updateProject(project: Project, images: File[]) {
        const projectData = new FormData();
        project.team = project.team.flat();
        project.techStack = project.techStack.flat();
        projectData.append('project', JSON.stringify(project));

        for(let i = 0; i < images.length; i++) {
            projectData.append('images', images[i], images[i].name); 
        }

        this.httpClient.put<{ message: string, project: Project }>(`${environment.baseUrl}/api/projects/${project.id}`, projectData) 
            .subscribe((responseData) => {
                this.showMessageToUserSubject.next({ severity: 'success', summary: 'Erfolg', detail: 'Projekt geändert.' });
                setTimeout(() => {
                    // ugly workaround to refresh the page after editing a project
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                      this.router.navigate([this.router.url]);
                    });
                  }, 3000);
                project.id = responseData.project.id; 
                project.imagesPaths = responseData.project.imagesPaths;
                this.projects.push(project);
                this.projectsUpdated.next([...this.projects]);
        },
        error => {
            this.showMessageToUserSubject.next({ severity: 'error', summary: 'Fehler', detail: 'Projekt konnte nicht geändert werden.' });
        
        }); 
    }

    // Delete a project from the backend
    deleteProject(projectId: string) {
        this.httpClient.delete(`${environment.baseUrl}/api/projects/${projectId}`) 
            .subscribe(() => {
                this.showMessageToUserSubject.next({ severity: 'success', summary: 'Erfolg', detail: 'Projekt gelöscht.' });
                setTimeout(() => {
                    this.router.navigate(['/']);
                  }, 3000);
                const updatedProjects = this.projects.filter(project => project.id !== projectId);
                this.projects = updatedProjects;
                this.projectsUpdated.next([...this.projects]);
            },
            error => {
                this.showMessageToUserSubject.next({ severity: 'error', summary: 'Fehler', detail: 'Projekt konnte nicht gelöscht werden.' });
            }); 
    }
}