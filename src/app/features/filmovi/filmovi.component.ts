import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
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

 
  constructor(

    private filmoviService: FilmoviService,

    private router: Router,

    private http: HttpClient 

  ) {}
  ngOnInit(): void {
    this.filmoviService.getFilmovi().subscribe((data: any[]) => {
      this.filmovi = data;
      this.filteredFilmovi = data;
    });

    this.updateUserStatus();
    this.loadRezervisaniFilmovi();
    this.ucitajKorpu();
  }
  getUsernameFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
        const decoded: any = jwtDecode(token);
        console.log('Dekodirani JWT token:', decoded);
        return decoded.email || ''; 
    } catch (error) {
        console.error('Greška pri dekodiranju tokena:', error);
        return '';
    }
}
updateUserStatus(): void {
  this.isLoggedIn = !!localStorage.getItem('token');

  if (this.isLoggedIn) {
      this.username = this.getUsernameFromToken();
      if (!this.username) {
          console.error('Nije pronađen username u tokenu!');
      }
  }
}

  openFilmDetails(film: any): void {
    this.selectedFilm = film;
    this.loadReviews(film.movieId);
    document.body.classList.add('no-scroll');
    document.documentElement.classList.add('no-scroll');
  }

  closeModal(): void {
    this.selectedFilm = null;
    this.selectedRating = 5;
    this.selectedComment = '';
    document.body.classList.remove('no-scroll');
    document.documentElement.classList.remove('no-scroll');
  }
  loadReviews(movieId: number): void {
    this.filmoviService.getReviews(movieId).subscribe((reviews: any[]) => {
      this.filmReviews = reviews;
      this.calculateAverageRating();
    });
  }

  submitReview(): void {
    if (!this.isLoggedIn) {
        console.warn('🔴 Korisnik nije prijavljen! Preusmeravanje na login...');
        this.router.navigate(['/login']);
        return;
    }

    if (!this.selectedFilm) return;

    const email = this.username; 

    
    this.http.get<any[]>(`http://localhost:5000/reviews?filmId=${this.selectedFilm.movieId}&email=${email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
        next: (reviews: any[]) => {
            if (reviews.length > 0) {
                alert('⚠ Već ste ocenili ovaj film!');
                return;
            }

            
            if (!this.selectedRating || !this.selectedComment.trim()) {
                alert('⚠ Morate uneti sve podatke!');
                return;
            }

          
            this.http.get<any[]>(`http://localhost:5000/api/rezervacije`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            }).subscribe({
                next: (reservations: any[]) => {
                    const hasWatched = reservations.some(rez => rez.film_title === this.selectedFilm.title);

                    if (!hasWatched) {
                        alert('❌ Ne možete ostaviti recenziju jer niste gledali ovaj film.');
                        return;
                    }

                 
                    const newReview = {
                        filmId: this.selectedFilm.movieId,
                        rating: this.selectedRating,
                        comment: this.selectedComment
                    };

                    console.log('✅ Podaci koji se šalju na backend:', newReview);

                    this.filmoviService.submitReview(newReview).subscribe({
                        next: (response) => {
                            console.log('✅ Recenzija uspešno sačuvana:', response);
                            this.selectedComment = '';
                            this.selectedRating = 5;
                            this.loadReviews(this.selectedFilm.movieId);
                        },
                        error: (error: any) => {
                            console.error('❌ Greška prilikom slanja recenzije:', error);
                        }
                    });
                },
                error: (error: any) => {
                    console.error('❌ Greška pri proveri rezervacija:', error);
                    alert('Došlo je do greške pri proveri rezervacija.');
                }
            });
        },
        error: (error: any) => {
            console.error('❌ Greška pri proveri postojećih recenzija:', error);
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

  deleteAllReviews(): void {
    if (!this.selectedFilm) return;
    this.filmoviService.deleteReviews(this.selectedFilm.movieId).subscribe(() => {
      this.filmReviews = [];
      this.averageRating = 0;
    });
  }

  filterMovies(): void {
    const selectedYear = this.searchYear ? new Date(this.searchYear).getFullYear().toString() : '';

    this.filteredFilmovi = this.filmovi.filter(film =>
      film.title.toLowerCase().includes(this.searchTitle.toLowerCase()) &&
      film.director?.name?.toLowerCase().includes(this.searchDirector.toLowerCase()) &&
      (selectedYear ? film.startDate.toString().includes(selectedYear) : true)
    );
  }

  loadRezervisaniFilmovi(): void {
    this.rezervisaniFilmovi = JSON.parse(localStorage.getItem('rezervisaniFilmovi') || '[]');
  }

  otkaziRezervaciju(filmTitle: string): void {
    let rezervisani = JSON.parse(localStorage.getItem('rezervisaniFilmovi') || '[]');
    rezervisani = rezervisani.filter((film: any) => film.title !== filmTitle);
    localStorage.setItem('rezervisaniFilmovi', JSON.stringify(rezervisani));
    this.loadRezervisaniFilmovi();
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  dodajUKorpu(film: any): void {
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
    this.korpa = JSON.parse(localStorage.getItem('korpa') || '[]');
  }
}
