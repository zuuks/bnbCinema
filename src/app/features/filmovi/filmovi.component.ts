import { Component } from '@angular/core';
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

  constructor(private filmoviService: FilmoviService) { }

  ngOnInit(): void {
    this.filmoviService.getFilmovi().subscribe((data: any[]) => {
      this.filmovi = data;
      this.filteredFilmovi = data;
    });

    this.updateUserStatus();
    this.loadRezervisaniFilmovi();
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
      alert("Morate biti prijavljeni da biste komentarisali!");
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

  rezervisiFilm(film: any): void {
    if (!this.isLoggedIn) {
      alert("Morate biti prijavljeni da biste rezervisali film!");
      return;
    }

    let rezervisani = JSON.parse(localStorage.getItem('rezervisaniFilmovi') || '[]');

    if (rezervisani.some((rezervisan: any) => rezervisan.title === film.title)) {
      alert("Već ste rezervisali ovaj film!");
      return;
    }

    rezervisani.push(film);
    localStorage.setItem('rezervisaniFilmovi', JSON.stringify(rezervisani));
    this.loadRezervisaniFilmovi();
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

  filterMovies(): void {
    const selectedYear = this.searchYear ? new Date(this.searchYear).getFullYear().toString() : '';

    this.filteredFilmovi = this.filmovi.filter(film =>
        film.title.toLowerCase().includes(this.searchTitle.toLowerCase()) &&
        film.director?.name?.toLowerCase().includes(this.searchDirector.toLowerCase()) &&
        (selectedYear ? film.startDate.toString().includes(selectedYear) : true)
    );
}
get isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
}


}
