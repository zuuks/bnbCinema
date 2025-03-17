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
  filmReviews: { rating: number; comment: string }[] = [];
  averageRating: number = 0; // ⭐ Prosečna ocena

  constructor(private filmoviService: FilmoviService) { }

  ngOnInit(): void {
    this.filmoviService.getFilmovi().subscribe((data: any[]) => {
      this.filmovi = data;
      this.filteredFilmovi = data;
    });
  }

  filterMovies(): void {
    const selectedYear = this.searchYear ? new Date(this.searchYear).getFullYear().toString() : '';

    this.filteredFilmovi = this.filmovi.filter(film =>
      film.title.toLowerCase().includes(this.searchTitle.toLowerCase()) &&
      film.director.name.toLowerCase().includes(this.searchDirector.toLowerCase()) &&
      (selectedYear ? film.startDate.toString().includes(selectedYear) : true)
    );
  }

  // 📌 Otvaranje modal prozora i učitavanje postojećih ocena
  openFilmDetails(film: any): void {
    this.selectedFilm = film;
    this.loadReviews(film.title);
  }

  // 📌 Zatvaranje modal prozora
  closeModal(): void {
    this.selectedFilm = null;
    this.selectedRating = 5;
    this.selectedComment = '';
  }

  // 📌 Čuvanje ocena i komentara u `localStorage`
  submitReview(): void {
    if (!this.selectedFilm) return;

    // Osiguravamo da se ocena čuva kao broj
    const newReview = { rating: Number(this.selectedRating), comment: this.selectedComment };

    let reviews = JSON.parse(localStorage.getItem(this.selectedFilm.title) || '[]');

    reviews.push(newReview);
    localStorage.setItem(this.selectedFilm.title, JSON.stringify(reviews));

    this.loadReviews(this.selectedFilm.title);
    this.selectedComment = '';
}

  // 📌 Učitavanje ocena iz `localStorage` i izračunavanje prosečne ocene
  loadReviews(filmTitle: string): void {
    this.filmReviews = JSON.parse(localStorage.getItem(filmTitle) || '[]');
    this.calculateAverageRating();
  }

// 📌 Izračunavanje prosečne ocene
calculateAverageRating(): void {
  if (this.filmReviews.length === 0) {
      this.averageRating = 0;
      return;
  }

  // Osiguravamo da se sve ocene sabiraju kao brojevi
  const total = this.filmReviews.reduce((sum, review) => sum + review.rating, 0);

  this.averageRating = total / this.filmReviews.length;
}
}
