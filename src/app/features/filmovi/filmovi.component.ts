import { Component, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FilmoviService } from './filmovi.service';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-filmovi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filmovi.component.html',
  styleUrls: ['./filmovi.component.css']
})
export class FilmoviComponent {
  @Output() korpaOsvezena = new EventEmitter<void>();

  filmovi: any[] = [];
  filteredFilmovi: any[] = [];
  searchTitle: string = '';
  searchDirector: string = '';
  searchYear: string = '';
  searchGenre: string = '';
  hoveredFilm: any = null;

  selectedFilm: any = null;
  selectedRating: number = 5;
  selectedComment: string = '';
  filmReviews: { username: string; rating: number; comment: string }[] = [];
  averageRating: number = 0;
  isLoggedIn: boolean = false;
  username: string = '';
  rezervisaniFilmovi: any[] = [];
  korpa: any[] = [];

  isBrowser: boolean;

  constructor(
    private filmoviService: FilmoviService,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.filmoviService.getFilmovi().subscribe((data: any[]) => {
      this.filmovi = data;
      this.filteredFilmovi = data;
    });

    this.updateUserStatus();
    this.loadRezervisaniFilmovi();
    this.ucitajKorpu();
  }
  getGenresAsString(film: any): string {
    if (!film.movieGenres) return '';
    return film.movieGenres.map((g: any) => g.genre.name).join(', ');
  }
  
  
  getUsernameFromToken(): string {
    if (!this.isBrowser) return '';
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const decoded: any = jwtDecode(token);
      return decoded.email || ''; 
    } catch (error) {
      console.error('Greška pri dekodiranju tokena:', error);
      return '';
    }
  }

  updateUserStatus(): void {
    if (!this.isBrowser) return;
    this.isLoggedIn = !!localStorage.getItem('token');

    if (this.isLoggedIn) {
      this.username = this.getUsernameFromToken();
    }
  }

  openFilmDetails(film: any): void {
    this.selectedFilm = film;
    this.loadReviews(film.movieId);
    if (this.isBrowser) {
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
    }
  }

  closeModal(): void {
    this.selectedFilm = null;
    this.selectedRating = 5;
    this.selectedComment = '';
    if (this.isBrowser) {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    }
  }

  loadReviews(movieId: number): void {
    this.filmoviService.getReviews(movieId).subscribe((reviews: any[]) => {
      this.filmReviews = reviews;
      this.calculateAverageRating();
    });
  }

  submitReview(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selectedFilm || !this.isBrowser) return;

    const email = this.username;

    this.http.get<any[]>(`http://localhost:5000/reviews?filmId=${this.selectedFilm.movieId}&email=${email}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (reviews: any[]) => {
        if (reviews.length > 0) {
          alert('Već ste ocenili ovaj film!');
          return;
        }

        if (!this.selectedRating || !this.selectedComment.trim()) {
          alert('Morate uneti sve podatke!');
          return;
        }

        this.http.get<any[]>(`http://localhost:5000/api/rezervacije`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).subscribe({
          next: (reservations: any[]) => {
            const hasWatched = reservations.some(rez => rez.film_title === this.selectedFilm.title);

            if (!hasWatched) {
              alert('Ne možete ostaviti recenziju jer niste gledali ovaj film.');
              return;
            }

            const newReview = {
              filmId: this.selectedFilm.movieId,
              rating: this.selectedRating,
              comment: this.selectedComment
            };

            this.filmoviService.submitReview(newReview).subscribe({
              next: () => {
                this.selectedComment = '';
                this.selectedRating = 5;
                this.loadReviews(this.selectedFilm.movieId);
              },
              error: (error: any) => {
                console.error('Greška prilikom slanja recenzije:', error);
              }
            });
          },
          error: (error: any) => {
            console.error('Greška pri proveri rezervacija:', error);
            alert('Došlo je do greške pri proveri rezervacija.');
          }
        });
      },
      error: (error: any) => {
        console.error('Greška pri proveri postojećih recenzija:', error);
        alert('Došlo je do greške pri proveri postojećih recenzija.');
      }
    });
  }

  calculateAverageRating(): void {
    if (this.filmReviews.length === 0) {
      this.averageRating = 0;
      return;
    }

    const total = this.filmReviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = total / this.filmReviews.length;
  }

  filterMovies(): void {
    const selectedYear = this.searchYear ? new Date(this.searchYear).getFullYear().toString() : '';
  
    this.filteredFilmovi = this.filmovi.filter(film =>
      film.title.toLowerCase().includes(this.searchTitle.toLowerCase()) &&
      film.director?.name?.toLowerCase().includes(this.searchDirector.toLowerCase()) &&
      (selectedYear ? film.startDate.toString().includes(selectedYear) : true) &&
      (this.searchGenre
        ? film.movieGenres?.some((g: any) =>
            g.genre.name.toLowerCase().includes(this.searchGenre.toLowerCase())
          )
        : true)
    );
  }
  

  loadRezervisaniFilmovi(): void {
    if (!this.isBrowser) return;
    this.rezervisaniFilmovi = JSON.parse(localStorage.getItem('rezervisaniFilmovi') || '[]');
  }

  otkaziRezervaciju(filmTitle: string): void {
    if (!this.isBrowser) return;
    let rezervisani = JSON.parse(localStorage.getItem('rezervisaniFilmovi') || '[]');
    rezervisani = rezervisani.filter((film: any) => film.title !== filmTitle);
    localStorage.setItem('rezervisaniFilmovi', JSON.stringify(rezervisani));
    this.loadRezervisaniFilmovi();
  }

  get isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('token');
  }

  dodajUKorpu(film: any): void {
    if (!this.isBrowser) return;

    if (!this.isLoggedIn) {
      alert("Morate biti prijavljeni da biste dodali film u korpu!");
      return;
    }

    let korpa = JSON.parse(localStorage.getItem('korpa') || '[]');

    if (korpa.some((item: any) => item.title === film.title)) {
      alert("Ovaj film je već dodat u korpu!");
      return;
    }

    korpa.push(film);
    localStorage.setItem('korpa', JSON.stringify(korpa));

    this.korpaOsvezena.emit();
    this.ucitajKorpu();
  }

  ucitajKorpu(): void {
    if (!this.isBrowser) return;
    this.korpa = JSON.parse(localStorage.getItem('korpa') || '[]');
  }
}
