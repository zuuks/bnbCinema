import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http'; // OVO SE KORISTI UMESTO HttpClientModule
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { FilmoviComponent } from './features/filmovi/filmovi.component';
import { FilmoviService } from './features/filmovi/filmovi.service';
import { ContactComponent } from './features/contact/contact.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'filmovi', component: FilmoviComponent },
    { path: 'contact', component: ContactComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' } // Catch-all ruta za nepostojeće URL-ove
];

@NgModule({
    imports: [
        CommonModule, // OVO DODAJ
        BrowserModule,
        RouterModule.forRoot(routes) // Inicijalizacija rutiranja
    ],
    providers: [FilmoviService],
    bootstrap: [AppComponent]
})
export class AppModule { }