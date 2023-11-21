import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEventProposalComponent } from './all-event-proposal.component';

describe('AllEventProposalComponent', () => {
  let component: AllEventProposalComponent;
  let fixture: ComponentFixture<AllEventProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllEventProposalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEventProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
