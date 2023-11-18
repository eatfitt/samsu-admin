import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbIconLibraries } from '@nebular/theme';
import { Observable, map, of, startWith } from 'rxjs';
import { FileUploadService } from '../../../../../services/file-upload.service';
import { Event } from '../../../../@core/services/event/event.service';
import { getRandomDate } from '../../../../@core/utils/mock-data';

enum FeedbackType {
  MultipleSelect,
  SingleSelect,
  OpenEnded
}
interface Feedback {
  type: FeedbackType,
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

  // FORM DATA - ngModel
  title = '';
  editorContent = '';
  bannerImg: any = null;
  fileUrls: any = null;
  semester = 'FA23';
  proposalId = '14';
  startTime: Date = new Date();
  duration: number;

  event: Event = {
      semestersName: '',
      title: '',
      content: '',
      status: 1,
      startTime: getRandomDate(),
      duration: '',
      bannerUrls: '',
  }
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

  }
  constructor(
    iconsLibrary: NbIconLibraries,
    private uploadService: FileUploadService,
    private dialogService: NbDialogService,
    private cdr: ChangeDetectorRef,
  ) {
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
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
  onFileChange(data) {
    const file = data.target.files[0];
    if (file) {
      this.uploadService.uploadFile(file).subscribe(
        url => {
          console.log('File uploaded successfully. URL:', url);
          // Do something with the URL, such as updating the event object
          this.event.bannerUrls = url;
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

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }

  openDialog(dialog) {
    this.contentTemplateRef = this.dialogService.open(dialog);
  }
}
