import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { Group, GroupService } from '../../../../../@core/services/group/group.service';
import { UserService } from '../../../../../@core/services/user/user.service';
import { UserState } from '../../../../../app-state/user';

@Component({
  selector: 'ngx-add-event-attendance-list',
  templateUrl: './add-event-attendance-list.component.html',
  styleUrls: ['./add-event-attendance-list.component.scss']
})
export class AddEventAttendanceListComponent {
  @ViewChild('autoInput') groupInput;
  @ViewChild('confirmAddGroupDialog') confirmAddGroupDialog: TemplateRef<any>;
  private contentTemplateRef: NbDialogRef<AddEventAttendanceListComponent>;
  @Output() addAttendanceList = new EventEmitter<Group[]>();

  settings = {
    actions: {
      edit: false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: { },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      rollnumber: {
        title: "Roll Number",
        type: "string",
      },
      name: {
        title: "Name",
        type: "string",
      },
      email: {
        title: "Email",
        type: "string",
      },
    },
  };

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
    // iconsLibrary: NbIconLibraries
  ) {
    // iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }
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
    this.contentTemplateRef = this.dialogService.open(this.confirmAddGroupDialog);
  }

  addGroup() {
    this.attendanceList = this.attendanceList
      .concat(this.selectedGroup.users)
      .reduce((accumulator, current) => {
        if (!accumulator.some((item) => item.rollnumber === current.rollnumber)) {
          accumulator.push(current);
        }
        return accumulator;
      }, [])

    this.contentTemplateRef.close();
    this.addAttendanceList.emit(this.attendanceList);
  }
}
