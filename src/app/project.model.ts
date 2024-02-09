export interface Project {
    id?: string;
    title: string;
    start: Date; 
    end: Date;
    team: string[];
    techStack: string[];
    repositoryUrl: string;
    description: string; 
    imagesPaths?: string[];
    creator: string;
}