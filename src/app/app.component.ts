import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';

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
  title = 'Frontend';
}
