import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Project {
  title: string;
  tags: string[];
  image_url: string;
}

@Injectable({
  providedIn: 'root'
})

export class CockroachService {
  private baseApiUrl = 'https://main--calm-cat-bdfe20.netlify.app/.netlify/functions';
  private projectsRoute = '/projects';

  constructor(private http: HttpClient) {}

  fetchProjects(letter: string = ''): Observable<Project[]> {
    const url = this.baseApiUrl + this.projectsRoute + '?letter=' + (letter.length === 0 ? '' : letter);

    return this.http.get<Project[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching projects:', error);
        return throwError(error);
      })
    );
  }
}