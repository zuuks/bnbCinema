import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common'; // 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule], 
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
      } catch (error) {
        console.error('❌ Greška pri dekodiranju tokena:', error);
        this.username = 'Nepoznat korisnik';
        this.email = '';
      }
    }
  }

  updateProfile(): void {
    if (!this.newUsername && !this.newPassword) {
      alert('Molimo unesite novo korisničko ime ili novu šifru.');
      return;
    }

    const updatedData: any = {};
    if (this.newUsername) updatedData.username = this.newUsername;
    if (this.newPassword) updatedData.password = this.newPassword;


    
    this.authService.updateUser(this.email, updatedData).subscribe({
      next: (response: any) => {  
        console.log('✅ Uspešno ažurirano:', response);
        alert('Podaci su uspešno ažurirani!');
      },
      error: (error: any) => {
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
  }
}
