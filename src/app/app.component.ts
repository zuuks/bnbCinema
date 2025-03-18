import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service'; // Dodaj AuthService
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'BNB Cinema';

  footerUrl = '/about';
  footerLink = 'Saznaj više';

  korpa: any[] = [];
  cartOpen: boolean = false;
  isAuthenticated$: Observable<boolean>; // Observable za praćenje login statusa

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.user$; // Postavljamo observable iz AuthService-a
    this.ucitajKorpu();
  }

  ngOnInit() {
    this.isAuthenticated$ = this.authService.user$;
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
    let sveRezervacije = JSON.parse(localStorage.getItem('rezervisaniFilmovi') || '[]');
    sveRezervacije = sveRezervacije.concat(this.korpa);
    localStorage.setItem('rezervisaniFilmovi', JSON.stringify(sveRezervacije));

    alert('Sve rezervacije su uspešno potvrđene!');
    this.korpa = [];
    localStorage.removeItem('korpa');
    this.toggleCart();
  }

  // ✅ Logout funkcija
  logout() {
    this.authService.logout();
  }
}
