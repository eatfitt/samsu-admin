import { Component, Input, SimpleChanges, ChangeDetectionStrategy, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { Group, GroupService } from '../../../../@core/services/group/group.service';
import { isObject } from 'rxjs/internal-compatibility';
import { NbDialogRef, NbDialogService, NbMenuService, NbToastrService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { AllStudentsComponent } from '../../students/all-students/all-students.component';

@Component({
  selector: 'ngx-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupCardComponent {
  @ViewChild("changeGroupNameDialog", { static: true }) changeGroupNameDialog: TemplateRef<any>;
  @ViewChild("confirmDeleteDialog", { static: true }) confirmDeleteDialog: TemplateRef<any>;
  @Input() group: Group;
  @Input() bearerToken = '';
  @Output() apiReturnSuccessful = new EventEmitter<void>();
  memberCount = 0;
  groupName = '';
  groupActionItems = []
  isApiSuccess: boolean;
  isApiFailed: boolean;
  private contentTemplateRef: NbDialogRef<AllStudentsComponent>;

  constructor(
    private dialogService: NbDialogService,
    private groupService: GroupService,
    private toastrService: NbToastrService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const {group} = changes;
    if (isObject(group)) {
      this.memberCount = this.group.users.length;
      this.groupName = this.group.name;
      this.groupActionItems = [
        {title: 'Change group name', id: 1},
        {title: 'Delete group', id: 2},
      ]
    }
  }

  openDialog(action) {
    switch (action) {
      case 1: 
        this.dialogService.open(this.changeGroupNameDialog, {
          context: "",
        });
        break;
      case 2: 
        this.contentTemplateRef = this.dialogService.open(this.confirmDeleteDialog);
        break;
    }

  }

  onChangeGroupName() {
    this.groupService.putUpdateGroup(this.bearerToken, {userRollnumbers: this.group.users.map(user => user.rollnumber), name: this.groupName, id: this.group.id})
    .subscribe(
      data => {
        this.isApiFailed = false;
        this.isApiSuccess = true;
        this.apiReturnSuccessful.emit();
      },
      error => {
        console.error(error);
        this.isApiSuccess = false;
        this.isApiFailed = true;
      }
    )
  }

  deleteGroup() {
    this.contentTemplateRef.close();
    this.groupService.deleteGroup(this.bearerToken, this.group.id)
    .subscribe(
      data => this.toastrService.show('Deleted Successfully', `Success`, { status: 'success'}),
      error => this.toastrService.show('Deleted Failed', `Failed`, { status: 'danger'}),
      () => this.apiReturnSuccessful.emit()
    )
  }
}
