import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { GradeSubCriteria, GradeSubCriteriaService } from '../../../../@core/services/grade-sub-criteria/grade-sub-criteria.service';
import { UserService } from '../../../../@core/services/user/user.service';
import { NbTagComponent, NbTagInputAddEvent, NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { getAssigneeStatus, getTaskStatus } from '../../../../@core/utils/data-util';

interface GradeSubCriterias {
  id?: number;
  gradecriteriasId?: number;
  content: string;
  minScore: number;
  maxScore: number;
}
export interface Task {
  gradeSubCriteriaId?: number;
  gradeSubCriteria?: GradeSubCriteria;
  eventsId?: number;
  creatorUsersId?: number;
  title: string;
  content: string;
  score: number;
  status: number;
  createdAt?: Date;
  assignees: Assignee[];
  deadline: Date;
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

@Component({
  selector: 'ngx-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent {
  @Input() task: Task = {
    title: 'Task Title',
    content: 'Task Content',
    score: 0,
    status: 1,
    gradeSubCriteriaId: 1,
    assignees: [],
    deadline: new Date()
  }
  @Input() index: number;
  @Input() viewOnly: false; // default false;
  @Output() taskStatusChange = new EventEmitter<number>();
  @Output() removeTask = new EventEmitter<number>();
  existingUser$: Observable<Object> = null;
  gradeSubCriterias: GradeSubCriterias[] = [];
  rollnumberToSearch: string;
  assignees: Set<string> = new Set();

  constructor(
    private subCrit: GradeSubCriteriaService,
    private userService: UserService,
    public toastrService: NbToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.subCrit.getAllGradeSubCriterias()
      .subscribe((data: any) => this.gradeSubCriterias = data.content);
  }

  

  onAssigneeRemove(tagToRemove: NbTagComponent): void {
    this.task.assignees = this.task.assignees.filter(t => t.name !== tagToRemove.text);
  }

  onAssigneeAdd({ value, input }: NbTagInputAddEvent): void {
    if (value) {
      this.searchExistingUser(value);
    }
    input.nativeElement.value = '';
  }

  addAssignee(event) { // đang cho chọn 1 assignee thôi, không thì xài push -> chưa UI
    this.task.assignees[0] = event;
  }

  searchExistingUser(rollnumber: string) {
    this.existingUser$ = this.userService.findUserByRollnumber(rollnumber) || null;
    this.existingUser$.subscribe(
        (success: any) => {
          if (success !== undefined) {
            this.task.assignees = [...this.task.assignees, success];
            this.toastrService.show(`User: ${success.name}`, "User found", {
              status: "success",
            });
            this.cdr.detectChanges();
          }
        },
        (fail: any) => {
          this.toastrService.show(`User Not found`, "Not found", {
            status: "danger",
          });
        }
      );
  }

  selectSubCriteriaId(event: GradeSubCriteria) {
    this.task.gradeSubCriteria = event;
    this.task.gradeSubCriteriaId = event.id;
  }

  mockStatusList: TaskStatus[] = [
    TaskStatus.Pending,
    TaskStatus.OnGoing,
    TaskStatus.Incompleted,
    TaskStatus.Completed,
  ]

  checkRange(event: KeyboardEvent) {
    let input = event.target as HTMLInputElement;
    let value = Number(input.value + event.key);
    if (value > this.task.gradeSubCriteria.maxScore || value < this.task.gradeSubCriteria.minScore) {
        event.preventDefault();
    }
  }

  getTaskStatus(status: number) {
    return getTaskStatus(status);
  }

  getAssigneeStatus(status: number) {
    return getAssigneeStatus(status);
  }

  isDefaultTaskCheckin(task: Task) {
    if (task.title === 'Check In' && this.index === 0) return true;
    return false;
  }
}
