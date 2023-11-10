import { Component } from '@angular/core';
import { Task, TaskStatus } from '../../task-detail/task-detail.component';

@Component({
  selector: 'ngx-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  selectedTask: Task = null;
  mockTaskList: Task[] = [
    {
      id: 1,
      title: 'Contact Sponsors',
      content: 'Contact Sponsors',
      score: 4,
      status: TaskStatus.Pending,
      gradeSubCriteriasId: 1,
    },
    {
      id: 2,
      title: 'Design/Media',
      content: 'Design/Media',
      score: 3,
      status: TaskStatus.Pending,
      gradeSubCriteriasId: 1,
    },
  ]
}
