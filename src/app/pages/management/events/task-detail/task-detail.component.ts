import { Component, Input } from '@angular/core';

interface GradeSubCriterias {
  id?: number;
  gradecriteriasId?: number;
  content: string;
  minScore: number;
  maxScore: number;
}
export interface Task {
  id?: number;
  gradeSubCriteriasId?: number;
  eventsId?: number;
  creatorUsersId?: number;
  title: string;
  content: string;
  score: number;
  status: TaskStatus;
  createdAt?: Date;
}
interface Assignee {
  tasksId: number;
  usersId: number;
  status: AssigneeStatus;
}
export enum TaskStatus {
  Pending = 'Pending',
  OnGoing = 'OnGoing',
  Incompleted = 'Incompleted',
  Completed = 'Completed'
}
enum AssigneeStatus {
  Available,
  Quit
}

@Component({
  selector: 'ngx-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent {
  @Input() task: Task = {
    id: 1,
    title: 'Mock Title',
    content: 'Mock Title',
    score: 0,
    status: TaskStatus.Pending,
    gradeSubCriteriasId: 1,
  }
  mockGradeSubCriterias: GradeSubCriterias[] = [
    {
      id: 1,
      content: 'Check in students',
      minScore: 0,
      maxScore: 5
    },
    {
      id: 2,
      content: 'Prepare avenue',
      minScore: 3,
      maxScore: 10,
    }
  ]
  mockStatusList: TaskStatus[] = [
    TaskStatus.Pending,
    TaskStatus.OnGoing,
    TaskStatus.Incompleted,
    TaskStatus.Completed,
]
  mockAssignee = {
    tasksId: 1,
    name: 'Do Ngan Ha',
  }
}
