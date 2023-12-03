import {
  Component,
  Input,
  SimpleChanges,
  ChangeDetectionStrategy,
} from "@angular/core";
import {
  Event,
  EventParticipant,
} from "../../../../@core/services/event/event.service";
import _ from "lodash";
import { UserService } from "../../../../@core/services/user/user.service";
import {
  FeedbackService,
  GetAllAnswersByQuestionIdResponse,
  GetAllQuestionsByEventIdResponse,
} from "../../../../@core/services/feedback/feedback.service";
import { Observable, forkJoin, map, of, switchMap } from "rxjs";
import { ECharts } from 'echarts';

export interface MappedQuestionsAnswers {
  question: GetAllQuestionsByEventIdResponse;
  answers: GetAllAnswersByQuestionIdResponse[];
}

@Component({
  selector: "ngx-event-statistic",
  templateUrl: "./event-statistic.component.html",
  styleUrls: ["./event-statistic.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventStatisticComponent {
  @Input() event: Event = null;
  @Input() participants: EventParticipant[] = [];

  allQuestionsAndAnswers = new Observable<any>();
  progressInfoData = [];
  options: any = {};
  feedbackStat: any = []
  chartInstances: ECharts[] = [];

  studentCount: number;
  attendanceCount: number;
  checkInCount: number;
  checkOutCount: number;

  constructor(
    private userService: UserService,
    private feedbackService: FeedbackService,
  ) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe((data: any) => {
      this.studentCount = data.totalElements;
      this.calculateStat();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const { event, participants } = changes;
    if (_.isObject(event) || _.isObject(participants)) {
      this.attendanceCount = this.participants.length;
      this.checkInCount = this.participants.filter(
        (participant) => participant.checkin !== null
      ).length;
      this.checkOutCount = this.participants.filter(
        (participant) => participant.checkout !== null
      ).length;
      this.calculateStat();
      this.fetchData();
    }
  }

  createChartOption(item) {
    var option = {
        backgroundColor: echarts.bg,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                axisLabel: {
                  interval: 0,
                  rotate: 30
                }
            },
        ],
        yAxis: [
            {
                type: 'value',
            },
        ],
        series: [
            {
                // name: 'Score',
                type: 'bar',
                // barWidth: '60%',
                data: [],
            },
        ],
    };

    if (item.question.type === 0 || item.question.type === 1) {
        option.xAxis[0].data = item.question.answer.split('|');
        var answerCounts = {};
        item.answers.forEach(function(answer) {
            if (!answerCounts[answer.content]) {
                answerCounts[answer.content] = 0;
            }
            answerCounts[answer.content]++;
        });
        option.series[0].data = option.xAxis[0].data.map(function(answerOption) {
            return answerCounts[answerOption] || 0;
        });
    }
    return option;
}


  fetchData() {
    this.allQuestionsAndAnswers = this.feedbackService.getAllQuestionsByEventId(this.event.id).pipe(
      switchMap((questions: GetAllQuestionsByEventIdResponse[]) =>
        forkJoin(
          questions.map((question) =>
            this.feedbackService.getAllAnswersByQuestionId(question.id).pipe(
              map((answersData: any) => ({
                question: question,
                answers: answersData.content,
                chart: this.createChartOption({
                  question: question,
                  answers: answersData.content,
                })
              }))
            )
          )
        )
      )
    );
  }

  calculateStat() {
    this.progressInfoData = [
      {
        title: "Attendance",
        value: this.attendanceCount,
        activeProgress: (this.attendanceCount / this.studentCount) * 100,
        description: `Out of all FPT members (${Math.round(
          (this.attendanceCount / this.studentCount) * 100
        )}%)`,
      },
      {
        title: "Check in",
        value: this.checkInCount,
        activeProgress: (this.checkInCount / this.attendanceCount) * 100,
        description: `Out of all attendants (${Math.round(
          (this.checkInCount / this.attendanceCount) * 100
        )}%)`,
      },
      {
        title: "Check out",
        value: this.checkOutCount,
        activeProgress: (this.checkOutCount / this.attendanceCount) * 100,
        description: `Out of all attendants (${Math.round(
          (this.checkOutCount / this.attendanceCount) * 100
        )}%)`,
      },
    ];
  }

  onChartInit(ec: ECharts) {
    let chartInstance = ec;
    this.chartInstances.push(chartInstance);
  }

  exportData() {
    this.chartInstances.forEach(chart => {
      let img = new Image();
      img.src = chart.getDataURL({
          pixelRatio: 2,
          backgroundColor: '#fff'
      });
      console.log(img.src)
    })
  }
}
