import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmoviService } from './filmovi.service';
import { FormsModule } from '@angular/forms'; // ✅ Uključi FormsModule za [(ngModel)]

@Component({
  selector: 'app-filmovi',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Dodaj FormsModule
  templateUrl: './filmovi.component.html',
  styleUrls: ['./filmovi.component.css']
})
export class FilmoviComponent {
  filmovi: any[] = [];
  filteredFilmovi: any[] = [];
  searchTitle: string = '';
  searchDirector: string = '';
  searchYear: string = '';

  constructor(private filmoviService: FilmoviService) { }

  ngOnInit(): void {
    this.filmoviService.getFilmovi().subscribe((data: any[]) => {
      this.filmovi = data;
      this.filteredFilmovi = data; // Početni prikaz svih filmova
    });
  }

  // 🔍 Funkcija za pretragu filmova po naslovu, režiseru i godini
  filterMovies(): void {
    const selectedYear = this.searchYear ? new Date(this.searchYear).getFullYear().toString() : '';

    this.filteredFilmovi = this.filmovi.filter(film =>
      film.title.toLowerCase().includes(this.searchTitle.toLowerCase()) &&
      film.director.name.toLowerCase().includes(this.searchDirector.toLowerCase()) &&
      (selectedYear ? film.startDate.toString().includes(selectedYear) : true)
    );
  }
}
