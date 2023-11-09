import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NbIconLibraries } from '@nebular/theme';
import { Observable, map, of, startWith } from 'rxjs';
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
interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  size: string;
  kind: string;
  items?: number;
}

@Component({
  selector: 'ngx-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEventComponent implements OnInit {
  proposals: string[] = ['Proposal 1', 'Proposal 2', 'Proposal 3'];
  options: string[];
  filteredOptions$: Observable<string[]>;
  inputFormControl: FormControl;
  myForm: FormGroup;
  editorContent: string;
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };
  event: Event = {
      semestersName: '',
      title: '',
      content: '',
      status: '',
      startTime: getRandomDate(),
      duration: '',
      bannerUrls: '',
  }
  feedbackQuestionList: Feedback[] = [];
  ngOnInit(): void {
    this.options = ['Proposal 1', 'Proposal 2', 'Proposal 3', 'Proposal 4'];
    this.filteredOptions$ = of(this.options);

    this.inputFormControl = new FormControl();

    this.filteredOptions$ = this.inputFormControl.valueChanges
      .pipe(
        startWith(''),
        map(filterString => this.filter(filterString)),
      );

  }
  constructor(
    iconsLibrary: NbIconLibraries
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
  }


  deleteAnswer(i, j) {
    this.feedbackQuestionList[i].answer.splice(j, 1);
  }
  addAnswer(i) {
    this.feedbackQuestionList[i].answer.push('Sample answer');
  }
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(optionValue => optionValue.toLowerCase().includes(filterValue));
  }
}
