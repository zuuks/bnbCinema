import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilmoviService } from '../filmovi/filmovi.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  randomFilmovi: any[] = [];

  constructor(private filmoviService: FilmoviService) {}

  ngOnInit(): void {
    this.filmoviService.getFilmovi().subscribe((data: any[]) => {
      this.randomFilmovi = this.getRandomFilms(data, 5); // Uzimamo 5 filmova
    });
  }

  /** 🔀 Funkcija za biranje 5 nasumičnih filmova */
  getRandomFilms(films: any[], count: number): any[] {
    let shuffled = films.sort(() => 0.5 - Math.random()); // Mešamo filmove
    return shuffled.slice(0, count); // Uzimamo prvih 5
  }
}
