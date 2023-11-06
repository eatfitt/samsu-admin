import { Component } from '@angular/core';
import { Event } from '../../../../@core/services/event/event.service';
import { getRandomDate } from '../../../../@core/utils/mock-data';
import { NbIconLibraries } from '@nebular/theme';

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
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent {
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
}
