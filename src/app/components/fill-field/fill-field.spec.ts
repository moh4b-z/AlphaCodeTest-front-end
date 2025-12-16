import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillField } from './fill-field';

describe('FillField', () => {
  let component: FillField;
  let fixture: ComponentFixture<FillField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillField]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FillField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
