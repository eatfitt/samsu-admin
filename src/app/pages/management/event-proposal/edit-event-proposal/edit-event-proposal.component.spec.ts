import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventProposalComponent } from './edit-event-proposal.component';

describe('EditEventProposalComponent', () => {
  let component: EditEventProposalComponent;
  let fixture: ComponentFixture<EditEventProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventProposalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEventProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
