/**
*Ionic 4 Taxi Booking Complete App (https://store.enappd.com/product/taxi-booking-complete-dashboard)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/


import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditlocationnComponent } from './editlocationn.component';

describe('EditlocationnComponent', () => {
  let component: EditlocationnComponent;
  let fixture: ComponentFixture<EditlocationnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditlocationnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditlocationnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
