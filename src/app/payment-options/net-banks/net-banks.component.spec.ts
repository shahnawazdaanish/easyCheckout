import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetBanksComponent } from './net-banks.component';

describe('NetBanksComponent', () => {
  let component: NetBanksComponent;
  let fixture: ComponentFixture<NetBanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetBanksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
