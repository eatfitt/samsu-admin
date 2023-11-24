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
      status: TaskStatus.Pending,
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
}
