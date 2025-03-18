import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmoviService {
  private externalApiUrl = 'https://movie.pequla.com/api/movie?director=&actor=&search=&genre=';
  private localApiUrl = 'http://localhost:5000'; // Express server koji koristi MySQL

  constructor(private http: HttpClient) {}

  // Dobavljanje filmova sa eksternog API-ja
  getFilmovi(): Observable<any[]> {
    return this.http.get<any[]>(this.externalApiUrl);
  }

  // Dobavljanje recenzija iz MySQL baze
  getReviews(movieId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.localApiUrl}/reviews?filmId=${movieId}`);
  }

  // Slanje nove recenzije u MySQL bazu
  submitReview(review: { filmId: number; username: string; rating: number; comment: string }): Observable<any> {
    return this.http.post(`${this.localApiUrl}/reviews`, review);
  }

  // Brisanje svih recenzija za određeni film
  deleteReviews(movieId: number): Observable<any> {
    return this.http.delete(`${this.localApiUrl}/reviews?filmId=${movieId}`);
  }
}
