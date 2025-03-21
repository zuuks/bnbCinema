import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = 'Nepoznat korisnik';
  email: string = 'Nepoznata email adresa';
  newUsername: string = '';
  newPassword: string = '';
  reservations: any[] = [];

  isBrowser: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadUserData();
      this.loadReservations();
    }
  }

  loadUserData(): void {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.username = decoded.username || 'Korisnik';
        this.email = decoded.email || 'Nepoznata email adresa';
      } catch (error) {
        console.error('Greška pri dekodiranju tokena:', error);
        this.username = 'Nepoznat korisnik';
        this.email = '';
      }
    }
  }

  loadReservations(): void {
    if (!this.isBrowser) return;

    this.http.get<any[]>(`http://localhost:5000/api/rezervacije`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (data) => {
        this.reservations = data.map(rez => ({
          ...rez,
          datum: rez.datum.split('T')[0]
        }));
      },
      error: (error) => {
        console.error('Greška pri dohvatanju rezervacija:', error);
        this.reservations = [];
      }
    });
  }

  removeReservation(reservationId: number): void {
    if (!this.isBrowser) return;

    if (!confirm('Da li ste sigurni da želite da uklonite ovu rezervaciju?')) return;

    this.http.delete(`http://localhost:5000/api/rezervacije/${reservationId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => {
        this.reservations = this.reservations.filter(rez => rez.id !== reservationId);
      },
      error: (error) => {
        console.error('Greška pri brisanju rezervacije:', error);
        alert('Došlo je do greške pri brisanju rezervacije.');
      }
    });
  }

  updateProfile(): void {
    if (!this.isBrowser) return;

    if (!this.newUsername && !this.newPassword) {
      alert('Molimo unesite novo korisničko ime ili novu šifru.');
      return;
    }

    if (this.newPassword && this.newPassword.length < 6) {
      alert('Lozinka mora imati najmanje 6 karaktera.');
      return;
    }

    const updatedData: any = {};
    if (this.newUsername) updatedData.username = this.newUsername;
    if (this.newPassword) updatedData.password = this.newPassword;

    this.http.put(`http://localhost:5000/api/update-user`, {
      email: this.email,
      ...updatedData
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => {
        alert('Podaci su uspešno ažurirani!');
        this.loadUserData();
        this.newUsername = '';
        this.newPassword = '';
      },
      error: (error) => {
        console.error('Greška pri ažuriranju profila:', error);
        alert('Greška pri ažuriranju podataka.');
      }
    });
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }
  }
}
