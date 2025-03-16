import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true, // OVO DODAJ ZA STANDALONE KOMPONENTE
  imports: [
    MatToolbarModule,
    MatButtonModule,
    RouterOutlet
  ]
})
export class AppComponent {
  constructor(private router: Router) {
    (window as any).angularRouter = this.router; // Pravljenje globalnog router objekta
  }

  navigateTo(path: string) {
    console.log(`🔄 Navigacija ka: ${path}`);
    this.router.navigate([path])
      .then(success => console.log(`✅ Uspešna navigacija: ${success}`))
      .catch(error => console.error(`❌ Greška pri navigaciji:`, error));
  }
}