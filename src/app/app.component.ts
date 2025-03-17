import { Component, OnInit } from '@angular/core';
import { MovieService } from './movie.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-routing';
  footerUrl = 'https://www.ganatan.com';
  footerLink = 'www.ganatan.com';
}

