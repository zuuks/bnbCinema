import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { FilmoviComponent } from './features/filmovi/filmovi.component';
import { ContactComponent } from './features/contact/contact.component';
import { RezervacijaComponent } from './features/rezervacija/rezervacija.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'filmovi', component: FilmoviComponent },
    { path: 'rezervacija/:title', component: RezervacijaComponent },  // ✅ Koristimo `title`
    { path: 'contact', component: ContactComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' } // Catch-all ruta za nepostojeće URL-ove
];
