import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileBanksComponent } from './mobile-banks.component';

describe('MobileBanksComponent', () => {
  let component: MobileBanksComponent;
  let fixture: ComponentFixture<MobileBanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileBanksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
