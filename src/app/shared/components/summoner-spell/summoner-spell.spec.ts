import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SummonerSpellComponent } from './summoner-spell.component';

describe('PageNotFoundComponent', () => {
  let component: SummonerSpellComponent;
  let fixture: ComponentFixture<SummonerSpellComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SummonerSpellComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummonerSpellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
