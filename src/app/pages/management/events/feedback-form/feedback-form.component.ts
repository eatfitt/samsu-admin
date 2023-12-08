import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FeedbackQuestion } from '../../../../@core/services/event/event.service';

@Component({
  selector: 'ngx-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent {
  @Input() feedbackQuestions: Partial<FeedbackQuestion>[] = [];
  @Input() viewOnly = true;
  @Output() edit = new EventEmitter<FeedbackQuestion>();
}
