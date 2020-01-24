import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NearbydriverComponent } from './nearbydriver.component';

describe('NearbydriverComponent', () => {
  let component: NearbydriverComponent;
  let fixture: ComponentFixture<NearbydriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearbydriverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NearbydriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
