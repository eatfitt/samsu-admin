import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackEventProposalComponent } from './feedback-event-proposal.component';

describe('FeedbackEventProposalComponent', () => {
  let component: FeedbackEventProposalComponent;
  let fixture: ComponentFixture<FeedbackEventProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackEventProposalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackEventProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
