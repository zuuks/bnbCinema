import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilmoviService } from '../filmovi/filmovi.service';

@Component({
  selector: 'app-rezervacija',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rezervacija.component.html',
  styleUrls: ['./rezervacija.component.css']
})
export class RezervacijaComponent implements OnInit {
  film: any = null;
  korisnickoIme: string = '';
  brojKarata: number = 1;
  datum: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filmoviService: FilmoviService
  ) {}

  ngOnInit(): void {
    const filmTitle = this.route.snapshot.paramMap.get('title');

    this.filmoviService.getFilmovi().subscribe((filmovi) => {
      this.film = filmovi.find((f: any) => f.title.toLowerCase() === filmTitle?.toLowerCase());
    });
  }

  potvrdiRezervaciju(): void {
    if (!this.film || !this.korisnickoIme || !this.datum) {
      alert('Molimo popunite sva polja!');
      return;
    }

    const rezervacije = JSON.parse(localStorage.getItem('rezervisaniFilmovi') || '[]');
    rezervacije.push({
      film: this.film,
      korisnickoIme: this.korisnickoIme,
      brojKarata: this.brojKarata,
      datum: this.datum
    });

    localStorage.setItem('rezervisaniFilmovi', JSON.stringify(rezervacije));

    alert(`Uspešno ste rezervisali ${this.brojKarata} karata za "${this.film.title}"!`);
    this.router.navigate(['/filmovi']);
  }
}
