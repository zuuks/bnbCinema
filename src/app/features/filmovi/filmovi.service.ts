import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmoviService {
  private externalApiUrl = 'https://movie.pequla.com/api/movie?director=&actor=&search=&genre=';
  private localApiUrl = 'http://localhost:5000'; 

  constructor(private http: HttpClient) {}

  getFilmovi(): Observable<any[]> {
    return this.http.get<any[]>(this.externalApiUrl);
  }

  getReviews(movieId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.localApiUrl}/reviews?filmId=${movieId}`);
  }

  submitReview(review: { filmId: number; rating: number; comment: string }) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.post(`${this.localApiUrl}/reviews`, review, { headers });
}

  deleteReviews(movieId: number): Observable<any> {
    return this.http.delete(`${this.localApiUrl}/reviews?filmId=${movieId}`);
  }
}
