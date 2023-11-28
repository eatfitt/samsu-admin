import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import {
  NbDialogRef,
  NbDialogService,
  NbIconLibraries,
  NbToastrService,
} from "@nebular/theme";
import { Observable, map } from "rxjs";
import { FileUploadService } from "../../../../../services/file-upload.service";
import {
  CreateEventRequest,
  EventService,
  FeedbackQuestionRequest,
  TaskRequests
} from "../../../../@core/services/event/event.service";
import {
  GradeSubCriteria,
} from "../../../../@core/services/grade-sub-criteria/grade-sub-criteria.service";
import { UserService } from "../../../../@core/services/user/user.service";
import { Router } from "@angular/router";
import { EventProposalService } from "../../../../../services/event-propsal.service";
import { EventProposal } from "../../../../../services/event-propsal.service";
import { SemesterService } from "../../../../@core/services/semester/semester.service";
import _ from "lodash";
import { Task } from "../task-detail/task-detail.component";

enum FeedbackType {
  MultipleSelect = 0,
  SingleSelect = 1,
  OpenEnded = 2,
}
interface Feedback {
  type: number;
  question: string;
  answer: string[];
}
export const TaskStatusNumber = {
  'Pending': 1,
  'OnGoing': 2,
  'Incompleted': 3,
  'Completed': 4
}

@Component({
  selector: "ngx-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEventComponent implements OnInit {
  @ViewChild("importFeedbackFormDialog", { static: true })
  importFeedbackFormDialog: TemplateRef<any>;

  proposals: string[] = [];
  options: string[];
  filteredOptions$: Observable<string[]>;
  inputFormControl: FormControl;
  myForm: FormGroup;
  editorConfig = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };
  hours = Array.from({ length: 24 }, (_, i) => i);
  minutes = Array.from({ length: 60 }, (_, i) => i);
  selectedHour = 0;
  selectedMinute = 0;
  gradeSubCriterias: GradeSubCriteria[] = [];
  imageSrc: string | ArrayBuffer;
  myEventProposals$ = this.eventProposalService.getAllEventProposals().pipe(
    map(data => (data as any)?.content.filter(content => content.status === "APPROVED")),
  );
  eventLeaderRollnumberToSearch: string;
  eventLeader$: Observable<Object> = null;
  semesters$: Observable<Object> = null;

  // FORM DATA - ngModel
  title = "";
  content = "";
  bannerUrl: any = null;
  banner: File = null;
  fileUrls: any = null;
  file: File = null;
  semester = "FA23";
  proposalId = 14;
  startTime: Date = new Date();
  duration = 0;
  status = 2;
  attendScore = 0;
  eventLeaderRollnumber: string;

  // FEEDBACK TAB
  feedbackQuestionList: Feedback[] = [];
  sampleFeedbackQuestion: Feedback = {
    type: FeedbackType.OpenEnded,
    question: "",
    answer: [""],
  };
  // ATTENDANCE TAB
  attendanceList: any = [];
  // TASK TAB
  taskList: Task[] = [];

  private contentTemplateRef: NbDialogRef<AddEventComponent>;

  ngOnInit(): void {
    this.userService.checkLoggedIn();
    this.semesters$ = this.semesterService.getAllSemesters().pipe(map((data: any) => data.content));
  }

  constructor(
    iconsLibrary: NbIconLibraries,
    private eventService: EventService,
    private userService: UserService,
    private uploadService: FileUploadService,
    private dialogService: NbDialogService,
    public toastrService: NbToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private eventProposalService: EventProposalService,
    private semesterService: SemesterService,
  ) {
    iconsLibrary.registerFontPack("ion", { iconClassPrefix: "ion" });
  }

  changeDuration(event, time: string) {
    switch (time) {
      case "hour":
        this.selectedHour = event;
        break;
      case "minute":
        this.selectedMinute = event;
        break;
    }
    this.duration = (this.selectedHour * 60 + this.selectedMinute) * 60 * 1000;
  }

  importFeedbackFromExcel(data: any[][]) {
    const importedFeedbackQuestionList = data
      .splice(1, data.length)
      .map((item) => {
        console.log(item);
        const answerList: string[] = item.slice(2);
        const feedbackQuestion: Feedback = {
          type: item[0],
          question: item[1],
          answer: answerList,
        };
        return feedbackQuestion;
      });
    this.feedbackQuestionList = this.feedbackQuestionList.concat(
      importedFeedbackQuestionList
    );
    this.cdr.detectChanges();
    this.contentTemplateRef.close();
  }

  deleteAnswer(i, j) {
    this.feedbackQuestionList[i].answer.splice(j, 1);
  }
  addAnswer(i) {
    this.feedbackQuestionList[i].answer.push("Sample answer");
  }
  deleteQuestion(i) {
    this.feedbackQuestionList.splice(i, 1);
  }
  addQuestion() {
    let newQuestion = {...this.sampleFeedbackQuestion};
    newQuestion.answer = Array.from(this.sampleFeedbackQuestion.answer);
    this.feedbackQuestionList.push(newQuestion);
    this.cdr.detectChanges();
    this.contentTemplateRef.close();
  }
  onFileChange(data, file: string) {
    this[file] = data.target.files[0];
  }

  uploadFile(eventFileUrl: File, fileUrl: string) {
    this.uploadService.uploadFile(eventFileUrl).subscribe(
      (url) => {
        console.log("File uploaded successfully. URL:", url);
        // Do something with the URL, such as updating the event object
        this[fileUrl] = url;
      },
      (error) => {
        console.error("File upload failed:", error);
        // Handle error appropriately
      }
    );
  }

  addAttendanceList(event) {
    this.attendanceList = event;
  }

  setEventProposalId(event: EventProposal) {
    this.proposalId = event.id;
  }

  review() {
    this.uploadFile(this.banner, "bannerUrl");
    this.uploadFile(this.file, "fileUrls");
  }

  checkIsValidBeforeNext(properties: string []): boolean {
    return properties.every(property => {
      if (this[property] instanceof File && this[property].size > 0) {
        return true;
      }
      return !_.isEmpty(this[property]?.toString());
    })
  }

  isFeedbackValid(): boolean {
    if (this.feedbackQuestionList.length <= 0) return false;
    for (let feedback of this.feedbackQuestionList) {
      // Check if type is selected
      if (!feedback.type) {
        return false;
      }
  
      // Check if question is not empty
      if (!feedback.question || feedback.question.trim() === '') {
        return false;
      }
  
      // Check if answer is not null and not empty if it's an array of strings
      if (Array.isArray(feedback.answer)) {
        for (let answer of feedback.answer) {
          if (!answer || answer.trim() === '') {
            return false;
          }
        }
      }
    }
  
    // If all feedback objects pass the checks, return true
    return true;
  }

  createEvent() {
    const feedbackPayload: FeedbackQuestionRequest[] =
      this.feedbackQuestionList.map((question) => {
        return {
          question: question.question,
          type: question.type,
          answer: question.answer.join("|"),
        };
      });
    const rollnumbersPayload: string[] = this.attendanceList.map(
      (user) => user.rollnumber
    );
    const taskPayload: TaskRequests[] = this.taskList.map(task => {
      return {
        title: task.title,
        content: task.content,
        status: task.status,
        score: task.score,
        gradeSubCriteriaId: task.gradeSubCriteriaId,
        assignees: task.assignees.map(assignee => {
          return {
            status: 0,
            rollnumber: assignee.rollnumber
          }
        })
      }
    })
    const createEventPayload: CreateEventRequest = {
      status: Number(this.status),
      duration: Number(this.duration),
      attendScore: Number(this.attendScore),
      title: this.title,
      content: this.content,
      eventProposalId: Number(this.proposalId),
      eventLeaderRollnumber: this.eventLeaderRollnumber,
      semester: this.semester,
      bannerUrl: this.bannerUrl,
      fileUrls: this.fileUrls,
      startTime: this.startTime,
      feedbackQuestionRequestList: feedbackPayload,
      rollnumbers: rollnumbersPayload,
      taskRequests: taskPayload,
    };
    console.log(createEventPayload);
    this.eventService.createEvent(createEventPayload).subscribe(
      (success) => {
        this.toastrService.show("Event created successfully", "Success", {
          status: "success",
        });
        this.router.navigateByUrl("pages/events");
      },
      (error) => {
        this.toastrService.show("Try again", "Failed", { status: "danger" });
      }
    );
  }
  
  getQuestionType(string):number {
    if (string === 'MultipleSelect') return 0;
    if (string === 'SingleSelect') return 1;
    if (string === 'OpenEnded') return 2;
  }

  searchExistingUser(rollnumber: string) {
    this.eventLeader$ = this.userService.findUserByRollnumber(rollnumber) || null;
    this.eventLeader$.subscribe(
        (success: any) => {
          this.eventLeaderRollnumber = success.rollnumber;
          this.toastrService.show(`Event leader: ${success.name}`, "User found", {
            status: "success",
          });
          this.cdr.detectChanges();
        },
        (fail: any) => {
          this.eventLeaderRollnumber = null;
          this.toastrService.show(`User Not found`, "Not found", {
            status: "danger",
          });
        }
      );
  }

  trackByFn(index, item) {
    return index; 
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }
}
