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

    const rezervacija = {
      film: this.film,
      korisnickoIme: this.korisnickoIme,
      brojKarata: this.brojKarata,
      datum: this.datum
    };

    let korpa = JSON.parse(localStorage.getItem('korpa') || '[]');
    korpa.push(rezervacija);
    localStorage.setItem('korpa', JSON.stringify(korpa));

    alert(`"${this.film.title}" je dodat u korpu!`);
    this.router.navigate(['/filmovi']);
}

}
