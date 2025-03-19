import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmoviService } from './filmovi.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filmovi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filmovi.component.html',
  styleUrls: ['./filmovi.component.css']
})
export class FilmoviComponent {
  @Output() korpaOsvezena = new EventEmitter<void>(); // Emituje event za osvežavanje korpe

  filmovi: any[] = [];
  filteredFilmovi: any[] = [];
  searchTitle: string = '';
  searchDirector: string = '';
  searchYear: string = '';

  selectedFilm: any = null;
  selectedRating: number = 5;
  selectedComment: string = '';
  filmReviews: { username: string; rating: number; comment: string }[] = [];
  averageRating: number = 0;
  isLoggedIn: boolean = false;
  username: string = '';
  rezervisaniFilmovi: any[] = [];
  korpa: any[] = [];

  constructor(private filmoviService: FilmoviService) {}

  ngOnInit(): void {
    this.filmoviService.getFilmovi().subscribe((data: any[]) => {
      this.filmovi = data;
      this.filteredFilmovi = data;
    });

    this.updateUserStatus();
    this.loadRezervisaniFilmovi();
    this.ucitajKorpu();
  }

  updateUserStatus(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
    if (this.isLoggedIn) {
      const user = localStorage.getItem('user');
      this.username = user ? JSON.parse(user).name : '';
    }
  }

  openFilmDetails(film: any): void {
    this.selectedFilm = film;
    this.loadReviews(film.title);
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

  submitReview(): void {
    if (!this.isLoggedIn) {
      alert('Morate biti prijavljeni da biste komentarisali!');
      return;
    }

    if (!this.selectedFilm) return;

    const newReview = {
      username: this.username,
      rating: Number(this.selectedRating),
      comment: this.selectedComment
    };

    let reviews = JSON.parse(localStorage.getItem(this.selectedFilm.title) || '[]');
    reviews.push(newReview);
    localStorage.setItem(this.selectedFilm.title, JSON.stringify(reviews));

    this.loadReviews(this.selectedFilm.title);
    this.selectedComment = '';
  }

  loadReviews(filmTitle: string): void {
    this.filmReviews = JSON.parse(localStorage.getItem(filmTitle) || '[]');
    this.calculateAverageRating();
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
    localStorage.removeItem(this.selectedFilm.title);
    this.filmReviews = [];
    this.averageRating = 0;
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
