import { Component, Input, TemplateRef, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CreateEventRequest, Event, EventParticipant, EventService, FeedbackQuestion, FeedbackQuestionRequest } from '../../../../@core/services/event/event.service';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { convertMilliToDate, convertMillisToTime, getAssigneeStatus, getTaskStatus, isImageFile } from '../../../../@core/utils/data-util';
import _ from 'lodash';
import { FileUploadService } from '../../../../../services/file-upload.service';
import { FeedbackService } from '../../../../@core/services/feedback/feedback.service';
import { TaskService } from '../../../../@core/services/task/task.service';
import { Task } from '../task-detail/task-detail.component';
@Component({
  selector: 'ngx-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @ViewChild("eventBannerDialog", { static: true }) eventBannerDialog: TemplateRef<any>;
  @ViewChild('saveEditTemplate') saveEditTemplate: TemplateRef<any>;
  @ViewChild('addFeedbackQuestionDialog') addFeedbackQuestionDialog: TemplateRef<any>;

  @Input() event: Event = null;
  @Input() participants: EventParticipant[] = [];
  @Input() feedback: FeedbackQuestion[];
  @Input() viewOnly = false; // default false
  @Output() checkIn = new EventEmitter<void>();
  eventToEdit: Event = null;
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };
  durationObject = null;
  isShowStatistic = false;
  isShowPosts = false;
  
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
  reasonForManualCheckin = 'Student Card Unavailable';
  reasons = ['Student Card Unavailable', 'Others'];
  checkInMethod = 'National ID'
  checkInMethods = ['National ID', 'Driving License'];
  checkInNotes = 'N/A';
  rollnumberToCheckIn: string;

  // TASK MANAGEMENT
  selectedTask: Task = null;
  selectedIndex: number;

  // FEEDBACK MANAGEMENT
  sampleFeedback = {
    question: 'What do you think of the event?',
    answer: [''],
    type: 2
  };

  selectedFeedback = null;

  private contentTemplateRef: NbDialogRef<EventComponent>;

  constructor(
    private dialogService: NbDialogService,
    public toastrService: NbToastrService,
    private eventService: EventService,
    private uploadService: FileUploadService,
    private feedbackService: FeedbackService,
    private taskService: TaskService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    const { event, participants, feedback } = changes;
    if (_.isObject(event) || _.isObject(participants) || _.isObject(feedback)) {
      this.eventToEdit = {
        ...this.event,
        tasks: this.event?.tasks?.map((task) => {
          return {
            ... task,
            assignees: task.assignees.map((assignee: any) => {
              return {
                ...assignee,
                rollnumber: assignee.user ? assignee.user.rollnumber : assignee.rollnumber,
                name: assignee.user ? assignee.user.name : assignee.name,
                username: assignee.user ? assignee.user.username : assignee.username,
              }
            })
          }
        }),
        feedbackQuestions: this.feedback ?? this.event.feedbackQuestions
      };
      this.filteredParticipantList = this.participants;
      this.getDuration();
    }
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
      startTime: convertMilliToDate(this.eventToEdit.startTime) ,
      feedbackQuestionRequestList: this.eventToEdit.feedbackQuestions.map(question => {
        return {
          type: question.type,
          question: question.question,
          answer: question.answer,
        }
      }),
      // departmentIds: this.event.departments.map(department => department.name),  ---> không móc đc vì k có departmentId từ API
      rollnumbers: this.eventToEdit.participants.map(participant => participant.rollnumber),
      taskRequests: this.eventToEdit.tasks.map(task => {
        return {
          title: task.title,
          content: task.content,
          status: task.status,
          score: task.score,
          gradeSubCriteriaId: task.gradeSubCriteria.id,
          assignees: task.assignees.map(assignee => {
            return {
              rollnumber: assignee.rollnumber,
              status: assignee.status ?? 0,
            }
          }),
          deadline: task.deadline
        }
      }),
      subGradeCriteriaId: this.eventToEdit.gradeSubCriteriaResponse.id,
      processStatus: this.eventToEdit.processStatus,
    }
    this.eventService.updateEvent(eventPayload, this.event.id.toString())
      .subscribe(
        (success: any) => {
          this.toastrService.show("Edit successfully", "Success", {
            status: "success",
          });
          this.event = success;
          this.eventToEdit = success;
          this.setToViewMode();        },
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

  getDuration() {
    this.durationObject = convertMillisToTime(this.eventToEdit.duration);
  }

  filterParticipant(event) {
    this.filteredParticipantList = this.participants.filter(participant => participant.user.rollnumber.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  checkInManually(data) {
    console.log(data);
    this.eventService.checkInUser(this.event.id, data.rollnumber)
      .subscribe(
        (sucess: any) => {
          this.toastrService.show("Checked in Successfully", "Checked in", {
            status: "success",
          });
        },
        (failed: any) => {
          this.toastrService.show("Checked in Failed", "Failed", {
            status: "danger",
          });
        }
      )

    this.contentTemplateRef.close();
  }

  // TASK
  addTask() {

  }

  editTask(task: Task) {
    this.taskService.updateTaskById(this.selectedTask.id,
      {
        ...task,
        eventId: this.event.id,
        gradeSubCriteriaId: this.eventToEdit.tasks[this.selectedIndex].gradeSubCriteria.id
      }).subscribe(
        (data: any) => this.toastrService.show("Feedback updated successfully", "Success", {
          status: "success",
        }),
        (failed: any) => this.toastrService.show(failed, "Failed", {
          status: "danger",
        })
      )
  }

  editTaskStatus(index: number) {
    // this.eventToEdit.tasks[this.selectedIndex].status = index;
    // this.taskService.updateTaskById(this.selectedTask.id,
    //   {
    //     ...this.eventToEdit.tasks[this.selectedIndex],
    //     gradeSubCriteriaId: this.eventToEdit.tasks[this.selectedIndex].gradeSubCriteria.id
    //   }).subscribe(
    //     (data: any) => this.toastrService.show("Feedback updated successfully", "Success", {
    //       status: "success",
    //     }),
    //     (failed: any) => this.toastrService.show(failed, "Failed", {
    //       status: "danger",
    //     })
    //   )
    this.taskService.updateEventStatusByTaskId(this.selectedTask.id, index)
    .subscribe(
      (data: any) => this.toastrService.show("Asignee status updated successfully", "Success", {
        status: "success",
      }),
      (failed: any) => this.toastrService.show(failed, "Failed", {
        status: "danger",
      })
    )
  }

  changeAssigneeStatus(event) {
    this.taskService.updateAssigneeStatusByTaskId(this.selectedTask.id, event.status, event.assignee.rollnumber)
    .subscribe(
      (data: any) => this.toastrService.show("Asignee status updated successfully", "Success", {
        status: "success",
      }),
      (failed: any) => this.toastrService.show(failed, "Failed", {
        status: "danger",
      })
    )
  }

  deleteTask(i) {
    this.eventToEdit.tasks.splice(i, 1);
    this.editEvent();
    this.selectedTask = null;
  }

  updateTask() {
    
  }

  // FEEDBACK
  deleteAnswer(i) {
    this.selectedFeedback.answer.splice(i, 1);
  }
  addAnswer() {
    this.selectedFeedback.answer.push('');
  }
  addQuestion() {
    const feedbackPayload = {
      type: this.selectedFeedback.type,
      question: this.selectedFeedback.question,
      answer: this.selectedFeedback.answer.join("|"),
    }
    this.feedbackService.addQuestionByEventId(this.event.id, feedbackPayload)
      .subscribe(
        (data) => { this.toastrService.show("Feedback updated successfully", "Success", {
            status: "success",
          });
          this.selectedFeedback = this.sampleFeedback;
          this.checkIn.emit();
          this.contentTemplateRef.close();
        }
      )
  }

  getFeedbackToEdit(event) {
    this.selectedFeedback = {
      ...event,
      answer: event.answer.split("|")
    }
  }

  editQuestion() {
    const feedbackPayload = {
      type: this.selectedFeedback.type,
      question: this.selectedFeedback.question,
      answer: this.selectedFeedback.answer.join("|"),
    }
    this.feedbackService.edtQuestionById(this.selectedFeedback.id, feedbackPayload)
      .subscribe(
        (data) => { this.toastrService.show("Feedbkac updated successfully", "Success", {
            status: "success",
          });
          this.selectedFeedback = this.sampleFeedback;
          this.checkIn.emit();
          this.contentTemplateRef.close();
        }
      )
  }

  logger(event?) {
    console.log('Logger', event);
  }
  trackByFn(index, item) {
    return index; 
  }

  getTaskStatus(status: number) {
    return getTaskStatus(status);
  }

  getAssigneeStatus(status: number) {
    return getAssigneeStatus(status);
  }
}
