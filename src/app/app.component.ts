import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BNB Cinema';
  
  footerUrl = '/about';
  footerLink = 'Saznaj više';

  korpa: any[] = [];
  cartOpen: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.ucitajKorpu();
    }
  }

  toggleCart(): void {
    this.cartOpen = !this.cartOpen;
  }

  ucitajKorpu(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.korpa = JSON.parse(localStorage.getItem('korpa') || '[]');
    }
  }

  // ✅ Automatski osveži korpu kada se promeni stranica
  onActivate(event: any): void {
    this.ucitajKorpu();
  }

  potvrdiSveRezervacije(): void {
    if (this.korpa.length === 0) {
      alert('Vaša korpa je prazna.');
      return;
    }
  
    let sveRezervacije = JSON.parse(localStorage.getItem('rezervisaniFilmovi') || '[]');
    sveRezervacije = sveRezervacije.concat(this.korpa);
    localStorage.setItem('rezervisaniFilmovi', JSON.stringify(sveRezervacije));
  
    alert('Sve rezervacije su uspešno potvrđene!');
    
    // Praznimo korpu nakon potvrde
    this.korpa = [];
    localStorage.removeItem('korpa');
    this.toggleCart();
  }

  
  ukloniIzKorpe(rezervacija: any): void {
    this.korpa = this.korpa.filter(item => item !== rezervacija);
    localStorage.setItem('korpa', JSON.stringify(this.korpa));
  
    alert(`Uklonili ste "${rezervacija.film.title}" iz korpe.`);
  }
  
  
  preporuceniFilm: string | null = null;
  filmoviLista: string[] = ["Titanic", "Inception", "Avatar", "The Matrix", "Pulp Fiction", "Interstellar", "The Godfather"];
  preporuciFilm() {
    const randomIndex = Math.floor(Math.random() * this.filmoviLista.length);
    this.preporuceniFilm = this.filmoviLista[randomIndex];
  }
}
