import { Routes } from '@angular/router';
import { AboutComponent } from './features/about/about.component';
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
    { path: 'about', component: AboutComponent }, 
    { path: 'filmovi', component: FilmoviComponent },
    { path: 'rezervacija/:title', component: RezervacijaComponent },  
    { path: 'contact', component: ContactComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' } 
];
