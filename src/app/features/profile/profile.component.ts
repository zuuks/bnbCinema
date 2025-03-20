import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
import { AuthService } from '../../auth.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';  // ✅ DODAJ OVO
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common'; // 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, FormsModule],  // ✅ Ovdje dodaj FormsModule
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent implements OnInit {
  username: string = 'Nepoznat korisnik';
  email: string = 'Nepoznata email adresa';
  newUsername: string = '';
  newPassword: string = ''; 

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.username = decoded.username || 'Korisnik';
        this.email = decoded.email || 'Nepoznata email adresa';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      } catch (error) {
        console.error('❌ Greška pri dekodiranju tokena:', error);
        this.username = 'Nepoznat korisnik';
        this.email = '';
      }
    }
  }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  logout(): void {
    localStorage.removeItem('token'); // ✅ Brisanje tokena iz localStorage
    this.router.navigate(['/login']); // ✅ Preusmeravanje na login stranicu
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  updateProfile(): void {
    if (!this.newUsername && !this.newPassword) {
      alert('Molimo unesite novo korisničko ime ili novu šifru.');
      return;
    }

    const updatedData: any = {};
    if (this.newUsername) updatedData.username = this.newUsername;
    if (this.newPassword) updatedData.password = this.newPassword;


    
    this.authService.updateUser(this.email, updatedData).subscribe({
      next: (response: any) => {  // ✅ Dodali smo `: any`
        console.log('✅ Uspešno ažurirano:', response);
        alert('Podaci su uspešno ažurirani!');
      },
      error: (error: any) => {  // ✅ Dodali smo `: any`
        console.error('❌ Greška pri ažuriranju podataka:', error);
        alert('Došlo je do greške pri ažuriranju.');
      }
    });

    this.newUsername = '';
    this.newPassword = '';
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  }
}
