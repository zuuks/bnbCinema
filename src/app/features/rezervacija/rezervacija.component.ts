import { Component, OnInit, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  @Output() korpaOsvezena = new EventEmitter<void>();

  film: any = null;
  korisnickoIme: string = '';
  brojKarata: number = 1;
  datum: string = '';

  isBrowser: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private filmoviService: FilmoviService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    const filmTitle = this.route.snapshot.paramMap.get('title');

    this.filmoviService.getFilmovi().subscribe((filmovi) => {
      this.film = filmovi.find(
        (f: any) => f.title.toLowerCase() === filmTitle?.toLowerCase()
      );
    });
  }

  potvrdiRezervaciju(): void {
    if (!this.film || !this.korisnickoIme.trim() || !this.datum) {
      alert('Molimo popunite sva polja!');
      return;
    }

    const rezervacija = {
      film: this.film,
      korisnickoIme: this.korisnickoIme.trim(),
      brojKarata: this.brojKarata,
      datum: this.datum
    };

    if (this.isBrowser) {
      const korpa = JSON.parse(localStorage.getItem('korpa') || '[]');
      korpa.push(rezervacija);
      localStorage.setItem('korpa', JSON.stringify(korpa));
    }

    this.korpaOsvezena.emit();
    alert(`"${this.film.title}" je dodat u korpu!`);
    this.router.navigate(['/filmovi']);
  }
}
