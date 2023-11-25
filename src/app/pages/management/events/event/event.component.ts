import { Component, Input, TemplateRef, ViewChild, SimpleChanges } from '@angular/core';
import { CreateEventRequest, Event, EventService } from '../../../../@core/services/event/event.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { getRandomName, isImageFile } from '../../../../@core/utils/data-util';
import _ from 'lodash';
import { FileUploadService } from '../../../../../services/file-upload.service';
@Component({
  selector: 'ngx-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @ViewChild("eventBannerDialog", { static: true }) eventBannerDialog: TemplateRef<any>;
  @ViewChild('saveEditTemplate') saveEditTemplate: TemplateRef<any>;

  @Input() event: Event = null;
  eventToEdit: Event = null;
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };
  
  // CHECK FIELD IS EDITING
  isEditContent = false;
  isEditTitle = false;
  isEditEventLeader = false;
  isEditStartTime = false;
  isEditDuration = false;
  isEditScore = false;
  isEditEventProposal = false;
  isEditSemester = false;

  // PARTICIPANT MANAGEMENT
  filteredParticipantList = [];
  mockCheckInFlagParticipantList = [];
  filteredmockCheckInFlagParticipantList = [];
  reasonForManualCheckin = 'Student Card Unavailable';
  reasons = ['Student Card Unavailable', 'Others'];
  checkInMethod = 'National ID'
  checkInMethods = ['National ID', 'Driving License'];
  checkInNotes = 'N/A';
  rollnumberToCheckIn: string;

  // TASK MANAGEMENT
  selectedTask: Task = null;
  selectedTaskIndex: number;

  // MOCK Names
  randomNames = ["Do Ngan Ha", "Thai Van Man", "Nguyen Tran Thien Duc", "Truong Nguyen Anh Huy", "Do Dai Bach"];
  randomName = 'Do Ngan Ha';

  private contentTemplateRef: NbDialogRef<EventComponent>;

  constructor(
    private dialogService: NbDialogService,
    public toastrService: NbToastrService,
    private eventService: EventService,
    private uploadService: FileUploadService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    const { event } = changes;
    if (_.isObject(event)) {
      this.eventToEdit = { ...this.event };
      this.filteredParticipantList = this.event.participants;
      this.mockCheckInFlagParticipantList = this.filteredmockCheckInFlagParticipantList = this.event.participants.map(participant => {
        return { participant: participant, checkedIn: false, notes: '' };
      });
    }
    console.log(this.filteredParticipantList)
    console.log(this.eventToEdit)
    this.randomName = this.getRandomName();
  }

  editEvent() {
    const eventPayload: CreateEventRequest = {
      status: this.eventToEdit.status,
      duration: this.eventToEdit.duration,
      attendScore: this.eventToEdit.attendScore,
      title: this.eventToEdit.title,
      content: this.eventToEdit.content,
      eventProposalId: this.eventToEdit.eventProposalId,
      eventLeaderRollnumber: this.eventToEdit.eventLeader.rollnumber,
      semester: this.eventToEdit.semester.name,
      bannerUrl: this.eventToEdit.bannerUrl,
      fileUrls: this.eventToEdit.fileUrls,
      startTime: this.eventToEdit.startTime,
      feedbackQuestionRequestList: this.eventToEdit.feedbackQuestions.map(question => {
        return {
          type: question.type,
          question: question.question,
          answer: question.answer,
        }
      }),
      // departmentIds: this.event.departments.map(department => department.name),  ---> không móc đc vì k có departmentId từ API
      rollnumbers: this.eventToEdit.participants,
      taskRequests: this.eventToEdit.tasks.map(task => {
        return {
          title: task.title,
          content: task.content,
          status: task.status,
          score: task.score,
          gradeSubCriteriaId: task.gradeSubCriteria.id,
          assignees: [] // API đang thiếu k trả về assignees
        }
      })
    }
    this.eventService.updateEvent(eventPayload, this.event.id.toString())
      .subscribe(
        (success: any) => {
          this.toastrService.show("Edit successfully", "Success", {
            status: "success",
          });
          this.event = success;
          this.eventToEdit = success;
          this.setToViewMode();
        },
        (failed) => {
          this.toastrService.show("Edit failed", "Failed", {
            status: "danger",
          });
          this.eventToEdit = { ...this.event };
        }
      )
  }

  reset() {
    this.eventToEdit = {...this.event};
    this.setToViewMode();
  }

  setToViewMode() {
    this.isEditContent = false;
    this.isEditTitle = false;
    this.isEditEventLeader = false;
    this.isEditStartTime = false;
    this.isEditDuration = false;
    this.isEditScore = false;
    this.isEditEventProposal = false;
    this.isEditSemester = false;
  }

  uploadFile(data, fileUrl: string) {
    const file: File = data.target.files[0];
    this.uploadService.uploadFile(file).subscribe(
      (url) => {
        console.log("File uploaded successfully. URL:", url);
        // Do something with the URL, such as updating the event object
        this.eventToEdit[fileUrl] = url;
        this.editEvent();
      },
      (error) => {
        console.error("File upload failed:", error);
        // Handle error appropriately
      }
    );
  }

  isImageFile(fileUrl: string) {
    return isImageFile(fileUrl);
  }
  openDialog(dialog, data?) {
    this.contentTemplateRef = this.dialogService.open(dialog,
      { context: data });
  }

  getRandomName() {
    return getRandomName(this.randomNames);
  }

  filterParticipant(event) {
    this.filteredmockCheckInFlagParticipantList = this.mockCheckInFlagParticipantList.filter(participant => participant.participant.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  checkInManually() {
    this.toastrService.show("Checked in Successfully", "Checked in", {
      status: "success",
    });
    const rollNoToCheckin = this.filteredmockCheckInFlagParticipantList.findIndex((participant) => participant.participant === this.rollnumberToCheckIn);
    this.filteredmockCheckInFlagParticipantList[rollNoToCheckin].checkedIn = true;
    this.filteredmockCheckInFlagParticipantList[rollNoToCheckin].notes = `Check in via ${this.checkInMethod} due to ${this.reasonForManualCheckin}. Notes: ${this.checkInNotes}`;
    this.contentTemplateRef.close();
    this.checkInMethod = this.reasonForManualCheckin = this.checkInNotes;
  }
}
