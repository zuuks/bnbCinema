import { TestBed } from '@angular/core/testing';

import { FilmoviService } from './filmovi.service';

describe('FilmoviService', () => {
  let service: FilmoviService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilmoviService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
