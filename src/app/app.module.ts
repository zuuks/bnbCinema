import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilmoviComponent } from './components/filmovi/filmovi.component';
import { ProjekcijeComponent } from './components/projekcije/projekcije.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Uvoz zasebnog modula za Angular Material
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    FilmoviComponent,
    ProjekcijeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MaterialModule  // Dodajemo naš Angular Material module
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
