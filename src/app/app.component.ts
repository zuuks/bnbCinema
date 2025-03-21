import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

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
  isLoggedIn: boolean = false;
  username: string = '';
  email: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.ucitajKorpu();
      this.updateLoginStatus();
    }
  }

  toggleCart(): void {
    this.cartOpen = !this.cartOpen;
  }

  ucitajKorpu(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.korpa = JSON.parse(localStorage.getItem('korpa') || '[]');
  }

  onActivate(event: any): void {
    this.ucitajKorpu();
    this.updateLoginStatus();
  }

  updateLoginStatus(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.username = decoded.username || 'Korisnik';
        this.email = decoded.email || '';
      } catch (error) {
        console.error('Greška pri dekodiranju tokena:', error);
        this.username = 'Korisnik';
        this.email = '';
      }
    }
  }

  async potvrdiSveRezervacije(): Promise<void> {
    if (this.korpa.length === 0) {
      alert('Vaša korpa je prazna.');
      return;
    }

    if (!this.isLoggedIn) {
      alert('Morate biti prijavljeni da biste potvrdili rezervacije.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/rezervacije', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          username: this.username,
          email: this.email,
          rezervacije: this.korpa
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Došlo je do greške pri potvrdi rezervacija.');
      }

      alert('Sve rezervacije su uspešno potvrđene i sačuvane u bazi!');
      this.korpa = [];
      localStorage.removeItem('korpa');
      this.toggleCart();
    } catch (error) {
      console.error('Greška pri slanju rezervacija:', error);
      alert('Greška pri slanju rezervacija. Pokušajte ponovo.');
    }
  }

  ukloniIzKorpe(rezervacija: any): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.korpa = this.korpa.filter(item => item !== rezervacija);
    localStorage.setItem('korpa', JSON.stringify(this.korpa));
    alert(`Uklonili ste "${rezervacija.film.title}" iz korpe.`);
  }

  logout(): void {
    console.log(`Korisnik ${this.username} se odjavio.`);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }

    this.isLoggedIn = false;
    this.username = '';
    this.email = '';
    this.router.navigate(['/login']);
  }
}
