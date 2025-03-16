import { Component, OnInit } from '@angular/core';
import { BioskopService } from '../../services/bioskop.service';
import { Projekcija } from '../../models/projekcija.model';

@Component({
  selector: 'app-projekcije',
  templateUrl: './projekcije.component.html',
  styleUrls: ['./projekcije.component.css']
})
export class ProjekcijeComponent implements OnInit {
  projekcije: Projekcija[] = [];

  constructor(private bioskopService: BioskopService) {}

  ngOnInit() {
    this.projekcije = this.bioskopService.getProjekcije();
  }
}
