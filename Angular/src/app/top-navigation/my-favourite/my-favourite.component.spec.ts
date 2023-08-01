import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFavouriteComponent } from './my-favourite.component';

describe('MyFavouriteComponent', () => {
  let component: MyFavouriteComponent;
  let fixture: ComponentFixture<MyFavouriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyFavouriteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFavouriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
