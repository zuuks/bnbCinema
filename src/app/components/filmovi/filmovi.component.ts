import { Component } from '@angular/core';

@Component({
  selector: 'app-filmovi',
  template: `<h2>Filmovi komponenta učitana!</h2>`,
})
export class FilmoviComponent {
  constructor() {
    console.log('✅ FilmoviComponent je učitan!');
  }
}
