import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FilmoviComponent } from './features/filmovi/filmovi.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], // Dodaj RouterModule ovde
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BNB Cinema';
  
  footerUrl = '/about';
  footerLink = 'Saznaj više';

  
  korpa: any[] = [];
  cartOpen: boolean = false;

  constructor() {
    this.ucitajKorpu(); // Učitaj korpu pri pokretanju aplikacije
  }
  // Prikaži/Sakrij korpu
  toggleCart(): void {
    this.cartOpen = !this.cartOpen;
  }

  ucitajKorpu(): void {
    if (typeof window !== 'undefined' && localStorage) {
      this.korpa = JSON.parse(localStorage.getItem('korpa') || '[]');
    } else {
      this.korpa = [];
    }
}

  
  // Dodaj u korpu
  dodajUKorpu(rezervacija: any): void {
    this.korpa.push(rezervacija);
    localStorage.setItem('korpa', JSON.stringify(this.korpa));
  }

  // Ukloni iz korpe
  ukloniIzKorpe(rezervacija: any): void {
    this.korpa = this.korpa.filter(item => item !== rezervacija);
    localStorage.setItem('korpa', JSON.stringify(this.korpa));
  }

  // ✅ Potvrda svih rezervacija i pražnjenje korpe
  potvrdiSveRezervacije(): void {
    alert('Rezervacija potvrđena!');
    localStorage.removeItem('korpa');
    this.korpa = [];
    this.toggleCart();
  

    let sveRezervacije = JSON.parse(localStorage.getItem('rezervisaniFilmovi') || '[]');
    sveRezervacije = sveRezervacije.concat(this.korpa);
    localStorage.setItem('rezervisaniFilmovi', JSON.stringify(sveRezervacije));

    alert('Sve rezervacije su uspešno potvrđene!');
    this.korpa = [];
    localStorage.removeItem('korpa');
  }
}
