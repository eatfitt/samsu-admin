import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Group, GroupService } from '../../../../../@core/services/group/group.service';
import { GetAllUsersListResponse, UserService } from '../../../../../@core/services/user/user.service';
import { UserState } from '../../../../../app-state/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-add-event-attendance-list',
  templateUrl: './add-event-attendance-list.component.html',
  styleUrls: ['./add-event-attendance-list.component.scss']
})
export class AddEventAttendanceListComponent {
  @ViewChild('autoInput') groupInput;
  @ViewChild('addAttendanceDialog') addAttendanceDialog: TemplateRef<any>;
  private contentTemplateRef: NbDialogRef<AddEventAttendanceListComponent>;
  @Output() addAttendanceList = new EventEmitter<Group[]>();
  eventLeader$: Observable<Object> = null;

  bearerToken = '';
  groups: Group[] = [];
  filterGroups: Group[] = [];
  selectedGroup: Group;
  attendanceList = [];

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private store: Store<{ user: UserState }>,
    private dialogService: NbDialogService,
    public toastrService: NbToastrService,
  ) {}

  ngOnInit() {
    this.userService.checkLoggedIn();
    this.fetchData();
  }

  fetchData() {
    this.store
      .select((state) => state.user?.jwt?.jwtToken)
      .subscribe((token) => {
        this.bearerToken = `${token.tokenType} ${token.accessToken}`;
        this.groupService
          .getAllGroups(`${token.tokenType} ${token.accessToken}`)
          .subscribe((groups: Group[]) => this.groups = this.filterGroups = groups);
      });
  }

  getFilteredOptions(value: string): Group[] {
    return this.groups
      .filter(groupName => groupName.name.toLowerCase().includes(value.toLowerCase()));
  }

  onChange() {
    this.filterGroups = this.getFilteredOptions(this.groupInput.nativeElement.value);
  }

  onSelectGroup(event) {
    this.selectedGroup = this.groups.find(group => group.name === event);
    // this.contentTemplateRef = this.dialogService.open(this.confirmAddGroupDialog);
    this.addGroup(this.selectedGroup.users);
  }

  addGroup(userList: GetAllUsersListResponse[]) {
    this.attendanceList = this.attendanceList
      .concat(userList)
      .reduce((accumulator, current) => {
        if (!accumulator.some((item) => item.rollnumber === current.rollnumber)) {
          accumulator.push(current);
        }
        return accumulator;
      }, [])

    this.contentTemplateRef.close();
    this.addAttendanceList.emit(this.attendanceList);
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }

  searchExistingUser(rollnumber: string) {
    this.eventLeader$ = this.userService.findUserByRollnumber(rollnumber) || null;
    this.eventLeader$.subscribe(
        (success: any) => {
          this.addGroup([success])
          this.toastrService.show(`User: ${success.name}`, "User found", {
            status: "success",
          });
          this.addAttendanceList.emit(this.attendanceList);
          this.contentTemplateRef.close();
        },
        (fail: any) => {
          this.toastrService.show(`User Not found`, "Not found", {
            status: "danger",
          });
        }
      );
  }
  removeAttendance(index: number) {
    this.attendanceList.splice(index, 1);
    this.addAttendanceList.emit(this.attendanceList);
  }
}
