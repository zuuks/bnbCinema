import { Injectable } from '@angular/core';
import { Film } from '../models/film.model';
import { Projekcija } from '../models/projekcija.model';
import { Rezervacija } from '../models/rezervacija.model';

@Injectable({
  providedIn: 'root'
})
export class BioskopService {
  private filmovi: Film[] = [
    { id: 1, naziv: 'Dune: Part Two', zanr: 'Sci-Fi', trajanje: 165, opis: 'Nastavak epske priče...', slika: 'https://via.placeholder.com/200' },
    { id: 2, naziv: 'Oppenheimer', zanr: 'Drama', trajanje: 180, opis: 'Biografski film o Oppenheimeru...', slika: 'https://via.placeholder.com/200' }
  ];

  private projekcije: Projekcija[] = [
    { id: 1, filmId: 1, datum: new Date(), sala: 'Sala 1' },
    { id: 2, filmId: 2, datum: new Date(), sala: 'Sala 2' }
  ];

  private rezervacije: Rezervacija[] = [];

  getFilmovi(): Film[] {
    return this.filmovi;
  }

  getProjekcije(): Projekcija[] {
    return this.projekcije;
  }

  dodajRezervaciju(rezervacija: Rezervacija) {
    this.rezervacije.push(rezervacija);
  }
}
