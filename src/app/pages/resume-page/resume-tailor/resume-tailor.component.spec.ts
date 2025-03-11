import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeTailorComponent } from './resume-tailor.component';

describe('ResumeTailorComponent', () => {
  let component: ResumeTailorComponent;
  let fixture: ComponentFixture<ResumeTailorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeTailorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeTailorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
