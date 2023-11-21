import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbIconLibraries, NbToastrService } from '@nebular/theme';
import { Observable, map, of, startWith } from 'rxjs';
import { FileUploadService } from '../../../../../services/file-upload.service';
import { CreateEventRequest, Event, EventService, FeedbackQuestionRequest } from '../../../../@core/services/event/event.service';
import { getRandomDate } from '../../../../@core/utils/mock-data';
import { GradeSubCriteria, GradeSubCriteriaService } from '../../../../@core/services/grade-sub-criteria/grade-sub-criteria.service';
import { UserService } from '../../../../@core/services/user/user.service';
import { GetAllUsersListResponse, GetAllUsersResponse } from '../../../../@core/services/user/user.service';
import { Router } from '@angular/router';

enum FeedbackType {
  MultipleSelect = 0,
  SingleSelect = 1,
  OpenEnded = 2,
}
interface Feedback {
  type: FeedbackType | string,
  question: string,
  answer: string[],
}

@Component({
  selector: 'ngx-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEventComponent implements OnInit {
  @ViewChild("importFeedbackFormDialog", { static: true }) importFeedbackFormDialog: TemplateRef<any>;

  proposals: string[] = [];  // TODO: Implement proposals - Duc
  options: string[];
  filteredOptions$: Observable<string[]>;
  inputFormControl: FormControl;
  myForm: FormGroup;
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };
  hours = Array.from({length: 24}, (_, i) => i);
  minutes = Array.from({length: 60}, (_, i) => i);
  selectedHour = 0;
  selectedMinute = 0;
  gradeSubCriterias: GradeSubCriteria[] = [];
  imageSrc: string | ArrayBuffer;
  managerList: GetAllUsersListResponse[] = [];

  // FORM DATA - ngModel
  title = '';
  content = '';
  bannerUrl: any = null;
  fileUrls: any = null;
  semester = 'FA23';
  proposalId = 14;
  startTime: Date = new Date();
  duration = 0;
  status = 2;
  attendScore = 0;
  eventLeaderRollnumber: string;

  feedbackQuestionList: Feedback[] = [];
  sampleFeedbackQuestion: Feedback = {
    type: FeedbackType.OpenEnded,
    question: '',
    answer: [''],
  }
  attendanceList: any = [];

  private contentTemplateRef: NbDialogRef<AddEventComponent>;

  ngOnInit(): void {
    this.options = ['14'];
    this.filteredOptions$ = of(this.options);

    this.inputFormControl = new FormControl();

    this.filteredOptions$ = this.inputFormControl.valueChanges
      .pipe(
        startWith(''),
        map(filterString => this.filter(filterString)),
      );
    this.fetchData();
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
    private gradeSubCriteriaService: GradeSubCriteriaService
  ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  fetchData() {
    // this.gradeSubCriteriaService.getAllGradeSubCriterias()
    //   .subscribe((data: any) => this.gradeSubCriterias = data.content);
    this.userService.getAllUsers()
      .subscribe((data: GetAllUsersResponse) => {
        this.managerList = data.content
          .filter(c => c.role === 3)
          .map((c) => c)
      })
  }

  changeDuration(event, time: string) {
    switch (time) {
      case 'hour':
        this.selectedHour = event;
        break;
      case 'minute': 
      this.selectedMinute = event;
        break;
    }
    this.duration = ((this.selectedHour * 60 + this.selectedMinute) * 60 * 1000);
  }

  importFeedbackFromExcel(data: any[][]) {
    const importedFeedbackQuestionList = data.splice(1, data.length).map((item) => {
      console.log(item)
      const answerList: string[] = item.slice(2)
      const feedbackQuestion: Feedback = {
        type: item[0],
        question: item[1],
        answer: answerList,
      };
      return feedbackQuestion;
    });
    this.feedbackQuestionList = this.feedbackQuestionList.concat(importedFeedbackQuestionList);
    this.cdr.detectChanges(); 
    this.contentTemplateRef.close();
  }

  deleteAnswer(i, j) {
    this.feedbackQuestionList[i].answer.splice(j, 1);
  }
  addAnswer(i) {
    this.feedbackQuestionList[i].answer.push('Sample answer');
  }
  deleteQuestion(i) {
    this.feedbackQuestionList.splice(i, 1);
  }
  addQuestion() {
    this.feedbackQuestionList.push(this.sampleFeedbackQuestion);
    this.cdr.detectChanges(); 
    this.contentTemplateRef.close();
  }
  onFileChange(data, eventFileUrl: string) {
    // const file = data.target.files[0];
    
    if (data) {
      this.uploadService.uploadFile(data).subscribe(
        url => {
          console.log('File uploaded successfully. URL:', url);
          // Do something with the URL, such as updating the event object
          this[eventFileUrl] = url;
        },
        error => {
          console.error('File upload failed:', error);
          // Handle error appropriately
        }
      );
    }
  }

  addAttendanceList(event) {
    this.attendanceList = event;
  }
  
  setEventLeaderRollnumber(event: GetAllUsersListResponse) {
    this.eventLeaderRollnumber = event.rollnumber;
  }

  review() {
    this.onFileChange(this.bannerUrl, 'bannerUrl');
    this.onFileChange(this.fileUrls , 'fileUrls');
  }

  createEvent() {
    const feedbackPayload: FeedbackQuestionRequest[] = this.feedbackQuestionList.map(question => {
      return {
        ... question,
        type: FeedbackType[question.type],
        answer: question.answer.join('|'),
      }
    })
    const rollnumbersPayload: string[] = this.attendanceList.map(user => user.rollnumber)
    const createEventPayload: CreateEventRequest = {
      status: Number(this.status),
      duration: this.duration,
      attendScore: this.attendScore,
      title: this.title,
      content: this.content,
      eventProposalId: this.proposalId,
      eventLeaderRollnumber: this.eventLeaderRollnumber,
      semester: this.semester,
      bannerUrl: this.bannerUrl, // chua xai dc
      fileUrls: this.fileUrls,
      startTime: this.startTime,
      feedbackQuestionRequestList: feedbackPayload,
      rollnumbers: rollnumbersPayload
    }
    console.log(createEventPayload)
    this.eventService.createEvent(createEventPayload)
      .subscribe(
        success => {
          this.toastrService.show('Event created successfully', 'Success', {status: "success"});
          this.router.navigateByUrl('pages/events');
        },
        error => {
          this.toastrService.show('Try again', 'Failed', {status: "danger"});
        }
      )
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }
}
