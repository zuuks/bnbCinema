import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmoviService {
  private apiUrl = 'https://movie.pequla.com/api/movie?director=&actor=&search=&genre=';

  constructor(private http: HttpClient) { }

  getFilmovi(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
