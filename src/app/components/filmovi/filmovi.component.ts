import { Component, OnInit } from '@angular/core';
import { BioskopService } from '../../services/bioskop.service';
import { Film } from '../../models/film.model';

@Component({
  selector: 'app-filmovi',
  templateUrl: './filmovi.component.html',
  styleUrls: ['./filmovi.component.css']
})
export class FilmoviComponent implements OnInit {
  filmovi: Film[] = [];

  constructor(private bioskopService: BioskopService) {}

  ngOnInit() {
    this.filmovi = this.bioskopService.getFilmovi();
  }
}
