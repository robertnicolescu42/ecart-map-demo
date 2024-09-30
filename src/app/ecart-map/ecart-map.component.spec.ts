import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcartMapComponent } from './ecart-map.component';

describe('EcartMapComponent', () => {
  let component: EcartMapComponent;
  let fixture: ComponentFixture<EcartMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcartMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcartMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
