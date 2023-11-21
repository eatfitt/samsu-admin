import { Component } from '@angular/core';
import { Task, TaskStatus } from '../../task-detail/task-detail.component';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  selectedTask: Task = null;
  mockTaskList: Task[] = [
    {
      id: 0,
      title: 'Contact Sponsors',
      content: 'Contact Sponsors',
      score: 4,
      status: TaskStatus.Pending,
      gradeSubCriteriaId: 1,
      assignees: [],
    },
    {
      id: 1,
      title: 'Design/Media',
      content: 'Design/Media',
      score: 3,
      status: TaskStatus.Pending,
      gradeSubCriteriaId: 1,
      assignees: [],
    },
  ]

  constructor(
    iconsLibrary: NbIconLibraries,
  ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  ngOnInit() {
    this.selectedTask = this.mockTaskList[0];
  }

  addTask() {
    const sampleTask: Task = {
      id: this.mockTaskList.length ,
      title: 'Sample Task',
      content: '',
      score: 0,
      status: TaskStatus.Pending,
      gradeSubCriteriaId: 1,
      assignees: []
    }
    this.mockTaskList.push(sampleTask);
    this.selectedTask = this.mockTaskList[this.mockTaskList.length - 1];
  }

  deleteTask(i) {
    this.mockTaskList.splice(i, 1);
  }
}
