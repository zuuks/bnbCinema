import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmoviComponent } from './filmovi.component';

describe('FilmoviComponent', () => {
  let component: FilmoviComponent;
  let fixture: ComponentFixture<FilmoviComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmoviComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmoviComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
