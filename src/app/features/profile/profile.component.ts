import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, CommonModule } from '@angular/common';  

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

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadReservations();  
  }

  loadUserData(): void {
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
    if (!confirm('Da li ste sigurni da želite da uklonite ovu rezervaciju?')) {
      return;
    }
  
    this.http.delete(`http://localhost:5000/api/rezervacije/${reservationId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: () => {
        console.log(`Rezervacija sa ID ${reservationId} je uspešno obrisana.`);
        this.reservations = this.reservations.filter(rez => rez.id !== reservationId); 
      },
      error: (error) => {
        console.error('Greška pri brisanju rezervacije:', error);
        alert('Došlo je do greške pri brisanju rezervacije.');
      }
    });
  }
  
  updateProfile(): void {
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

    this.http.put(`http://localhost:5000/api/update-user`, { email: this.email, ...updatedData }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
        next: (response: any) => {
            console.log('Uspešno ažurirano:', response);
            alert('Podaci su uspešno ažurirani!');
            this.loadUserData();
        },
        error: (error: any) => {
            console.error('Greška pri ažuriranju podataka:', error);
            alert('Došlo je do greške pri ažuriranju.');
        }
    });

    this.newUsername = '';
    this.newPassword = '';
}




  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
