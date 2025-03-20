import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode'; // ✅ Import jwtDecode

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = 'Nepoznat korisnik';
  email: string = 'Nepoznata email adresa';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData(); // ✅ Poziv funkcije pri pokretanju komponente
  }

  loadUserData(): void {
    const token = localStorage.getItem('token'); // ✅ Uzimamo token iz localStorage
    if (token) {
      try {
        const decoded: any = jwtDecode(token); // ✅ Dekodiranje tokena
        this.username = decoded.username || 'Korisnik'; // ✅ Postavljanje korisničkog imena
        this.email = decoded.email || 'Nepoznata email adresa'; // ✅ Postavljanje emaila
      } catch (error) {
        console.error('❌ Greška pri dekodiranju tokena:', error);
        this.username = 'Nepoznat korisnik';
        this.email = '';
      }
    }
  }

  logout(): void {
    localStorage.removeItem('token'); // ✅ Brisanje tokena iz localStorage
    this.router.navigate(['/login']); // ✅ Preusmeravanje na login stranicu
  }
}
