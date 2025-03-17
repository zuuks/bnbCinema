import { Routes } from '@angular/router';

import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';

import { ContactComponent } from './features/contact/contact.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, },
    
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },

    { path: 'contact', component: ContactComponent },

   
];