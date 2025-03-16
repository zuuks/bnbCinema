import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmoviComponent } from './components/filmovi/filmovi.component';
import { ProjekcijeComponent } from './components/projekcije/projekcije.component';

const routes: Routes = [
  { path: 'filmovi', component: FilmoviComponent },
  { path: 'projekcije', component: ProjekcijeComponent },
  { path: '', redirectTo: '/filmovi', pathMatch: 'full' }, // Podrazumevana ruta
  { path: '**', redirectTo: '/filmovi' } // Ako ne postoji ruta, preusmeri na filmovi
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
