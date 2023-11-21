import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GradeSubCriteriaService } from '../../../../@core/services/grade-sub-criteria/grade-sub-criteria.service';
import { GetAllUsersResponse, UserService } from '../../../../@core/services/user/user.service';

interface GradeSubCriterias {
  id?: number;
  gradecriteriasId?: number;
  content: string;
  minScore: number;
  maxScore: number;
}
export interface Task {
  id?: number;
  gradeSubCriteriaId?: number;
  eventsId?: number;
  creatorUsersId?: number;
  title: string;
  content: string;
  score: number;
  status: TaskStatus;
  createdAt?: Date;
  assignees: Assignee[];
}

export interface Assignee {
  status: number;
  rollnumber: string;
  name?: string;
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
    title: 'Task Title',
    content: 'Task Content',
    score: 0,
    status: TaskStatus.Pending,
    gradeSubCriteriaId: 1,
    assignees: [],
  }
  @Output() taskChange = new EventEmitter<Task>();
  gradeSubCriterias: GradeSubCriterias[] = [];
  assignees: Assignee[] = [];

  constructor(
    private subCrit: GradeSubCriteriaService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.subCrit.getAllGradeSubCriterias()
      .subscribe((data: any) => this.gradeSubCriterias = data.content);
    this.userService.getAllUsers()
      .subscribe((data: GetAllUsersResponse) => {
        this.assignees = data.content.map((c) => {
          return {
            status: 0,
            rollnumber: c.rollnumber,
            name: c.name,
          }
        })
      })
  }

  addAssignee(event) { // đang cho chọn 1 assignee thôi, không thì xài push -> chưa UI
    this.task.assignees[0] = event;
  }

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
