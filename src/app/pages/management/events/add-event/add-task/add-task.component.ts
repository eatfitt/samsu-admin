import { Component, Input } from '@angular/core';
import { Task, TaskStatus } from '../../task-detail/task-detail.component';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  @Input() taskList: Task[] = [];
  selectedTask: Task = null;
  selectedIndex: number = null;

  constructor() {}

  addTask() {
    const sampleTask: Task = {
      title: 'New task',
      content: '',
      score: 0,
      status: 0,
      gradeSubCriteriaId: 1,
      assignees: []
    }
    this.taskList.push(sampleTask);
    this.selectedTask = this.taskList[this.taskList.length - 1];
  }

  deleteTask(i) {
    this.taskList.splice(i, 1);
    this.selectedTask = null;
  }

  getStatus(status: number) {
    if (status === 0) return 'Pending';
    else if (status === 1) return 'OnGoing';
    else if (status === 2) return 'Incompleted';
    else if (status === 3) return 'Completed';
  }
}
