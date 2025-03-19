import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  constructor() {
    this.ucitajKorpu(); 
  }

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

  dodajUKorpu(rezervacija: any): void {
    this.korpa.push(rezervacija);
    localStorage.setItem('korpa', JSON.stringify(this.korpa));
  }


  ukloniIzKorpe(rezervacija: any): void {
    this.korpa = this.korpa.filter(item => item !== rezervacija);
    localStorage.setItem('korpa', JSON.stringify(this.korpa));
  }

  potvrdiSveRezervacije(): void {
    alert('Rezervacija potvrđena!');
    localStorage.removeItem('korpa');
    this.korpa = [];
    this.toggleCart();
  }

  preporuceniFilm: string | null = null;
filmoviLista: string[] = ["Titanic", "Inception", "Avatar", "The Matrix", "Pulp Fiction", "Interstellar", "The Godfather"];

preporuciFilm() {
  const randomIndex = Math.floor(Math.random() * this.filmoviLista.length);
  this.preporuceniFilm = this.filmoviLista[randomIndex];
}

}
