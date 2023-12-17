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
import { BehaviorSubject, Observable, combineLatest, map, switchMap } from "rxjs";
import { FileUploadService } from "../../../../../services/file-upload.service";
import {
  CreateEventRequest,
  Event,
  EventParticipant,
  EventService,
  FeedbackQuestionRequest,
  TaskRequests
} from "../../../../@core/services/event/event.service";
import {
  GradeSubCriteria, GradeSubCriteriaService,
} from "../../../../@core/services/grade-sub-criteria/grade-sub-criteria.service";
import { GetAllUsersListResponse, UserService } from "../../../../@core/services/user/user.service";
import { Router } from "@angular/router";
import { EventProposalService } from "../../../../../services/event-propsal.service";
import { EventProposal } from "../../../../../services/event-propsal.service";
import { SemesterService } from "../../../../@core/services/semester/semester.service";
import _ from "lodash";
import { Task } from "../task-detail/task-detail.component";
import { DepartmentService } from "../../../../@core/services/department/department.service";
import { UserState, UserSummary } from "../../../../app-state/user";
import { Store } from "@ngrx/store";

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
  myEventProposals$: Observable<any>;
  eventLeaderRollnumberToSearch: string;
  eventLeader$: Observable<Object> = null;
  semesters$: Observable<Object> = null;
  departments$: Observable<Object> = null;
  eventLeader: GetAllUsersListResponse = null;
  eventReview: Event = null;
  participantReview: EventParticipant[] = [];
  aFileUploaded$ = new BehaviorSubject(null);
  today = new Date();
  minDate = new Date(this.today);
  gradeSubCriteria$: Observable<any> = this.gradeSubCritService.getAllGradeSubCriterias().pipe(map((data: any) => data.content)); 
  selectedSubGradeCriteria: GradeSubCriteria = null;

  // FORM DATA - ngModel
  title = "";
  content = "";
  bannerUrl: any = null;
  banner: File = null;
  fileUrls: any = null;
  file: File = null;
  semester = "FA23";
  department = null;
  proposalId = 14;
  startTime: Date = new Date(this.today);
  duration = 0;
  status = 2;
  attendScore = 0;
  eventLeaderRollnumber: string;
  subGradeCriteriaId: number;
  processStatus = 0;

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
  taskList: Task[] = [
    {
      title: 'Check In',
      content: 'Check In người tham gia',
      score: 0,
      status: 0,
      gradeSubCriteriaId: 1,
      gradeSubCriteria: null,
      assignees: [],
      deadline: this.startTime
    }
  ];

  // CHECK ROLE
  isAdmin = false;

  private contentTemplateRef: NbDialogRef<AddEventComponent>;

  ngOnInit(): void {
    this.userService.checkLoggedIn();
    this.store.select(state => state.user.userSummary).subscribe(userSummary => {
      this.isAdmin = (userSummary.role === 'ROLE_ADMIN');
    });
    this.myEventProposals$ = this.store.select(state => state.user.userSummary).pipe(
      switchMap((userSummary: UserSummary) => {
        return userSummary.role === 'ROLE_ADMIN'
          ? this.eventProposalService.getAllAvailableEventProposals()
          : this.eventProposalService.getMyAvailableEventProposal();
      }),
      map(data => (data as any)?.filter(content => content.status === "APPROVED")),
    );
    this.minDate.setDate(this.today.getDate());
    this.startTime.setDate(this.today.getDate() + 1);
    this.semesters$ = this.semesterService.getAllSemesters().pipe(map((data: any) => data.content));
    this.departments$ = this.departmentService.getAllDepartments().pipe(map((data: any) => data.content));
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
    private departmentService: DepartmentService,
    private gradeSubCritService: GradeSubCriteriaService,
    private store: Store<{ user: UserState }>,

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
    if (!this[fileUrl].includes('digitaloceanspaces')) {
      this.uploadService.uploadFile(eventFileUrl).subscribe(
        (url) => {
          console.log("File uploaded successfully. URL:", url);
          // Do something with the URL, such as updating the event object
          this[fileUrl] = url;
          this.createEventReview();
          this.aFileUploaded$.next(url);
        },
        (error) => {
          console.error("File upload failed:", error);
          this.aFileUploaded$.error(error);
          this.createEventReview();
          // Handle error appropriately
        }
      );
    }
    
  }

  createEventReview() {
    this.eventReview = {
      semestersName: this.semester,
      title: this.title,
      content: this.content,
      status: Number(this.status),
      startTime: this.startTime,
      duration: Number(this.duration),
      bannerUrl: this.bannerUrl ?? 'https://sgp1.digitaloceanspaces.com/samsu/assets/d66741de-93fc-4ca7-a393-2e75830fe34e_fpt-edu-got-talent-2023-820x1024.jpeg',
      fileUrls: this.fileUrls ?? 'https://sgp1.digitaloceanspaces.com/samsu/assets/b94705b8-9392-4b90-8eeb-a78004fddb22_samsu_event_attachment.xlsx',
      participants: this.attendanceList,
      attendScore: Number(this.attendScore),
      creator: null,
      eventLeader: this.eventLeader,
      departments: this.department,
      tasks: this.taskList.map(task => {
        return {
          id: null,
          creator: null,
          title: task.title,
          content: task.content,
          status: task.status,
          score: task.score,
          eventId: null,
          gradeSubCriteria: task.gradeSubCriteria,
          assignees: task.assignees,
          deadline: task.deadline
        }
      }),
      feedbackQuestions: this.feedbackQuestionList.map((question) => {
        return {
          question: question.question,
          type: question.type,
          answer: question.answer.join("|"),
          createdAt: null,
          id: null
        };
      }),
      gradeSubCriteriaResponse: this.selectedSubGradeCriteria,
      processStatus: this.processStatus
    }
    this.participantReview = this.attendanceList.map(user => {
      return {
        eventId: null,
        user: user,
        checkin: null,
        checkout: null,
      }
    })
  }

  setSubGradeCriteriaId(event) {
    this.subGradeCriteriaId = event.id;
    this.selectedSubGradeCriteria = event;
  }

  addAttendanceList(event) {
    this.attendanceList = event;
  }

  setEventProposalId(event: EventProposal) {
    this.proposalId = event.id;
  }

  uploadBannerAndAttachment() {
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
    feedbackPayload.push({
      question: 'Rate your experience',
      type: 3,
      answer: ''
    })
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
        }),
        deadline: task.deadline
      }
    })
    const departmentIdsPayload = this.department?.map(de => de.id);
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
      departmentIds: departmentIdsPayload,
      subGradeCriteriaId: this.subGradeCriteriaId,
      processStatus: 0,
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
          this.eventLeader = success;
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

  checkRange(event: KeyboardEvent) {
    let input = event.target as HTMLInputElement;
    let value = Number(input.value + event.key);
    if (value > this.selectedSubGradeCriteria.maxScore || value < this.selectedSubGradeCriteria.minScore) {
        event.preventDefault();
    }
  }
}
