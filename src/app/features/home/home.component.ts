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
      this.randomFilmovi = this.getRandomFilms(data, 5); 
    });
  }

  getRandomFilms(films: any[], count: number): any[] {
    let shuffled = films.sort(() => 0.5 - Math.random()); 
    return shuffled.slice(0, count); 
  }
}
