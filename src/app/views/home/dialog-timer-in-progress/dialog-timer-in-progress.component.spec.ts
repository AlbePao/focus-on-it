import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTimerInProgressComponent } from './dialog-timer-in-progress.component';

describe('DialogTimerInProgressComponent', () => {
  let component: DialogTimerInProgressComponent;
  let fixture: ComponentFixture<DialogTimerInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTimerInProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTimerInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
