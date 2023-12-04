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
import { Observable, forkJoin, map, switchMap } from "rxjs";
import { ECharts } from "echarts";
import { WorkBook, WorkSheet, read, utils, writeFileXLSX } from "xlsx";
import { convertMilliToDate, convertMillisToTime } from "../../../../@core/utils/data-util";

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
  _allQuestionsAndAnswers: any = null;
  progressInfoData = [];
  options: any = {};
  feedbackStat: any = [];
  chartInstances: ECharts[] = [];

  studentCount: number;
  attendanceCount: number;
  checkInCount: number;
  checkOutCount: number;

  constructor(
    private userService: UserService,
    private feedbackService: FeedbackService
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
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: { title: "Lưu thống kê", show: true },
        },
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisLabel: {
            interval: 0,
            rotate: 30,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          type: "bar",
          data: [],
        },
      ],
    };

    if (item.question.type === 0 || item.question.type === 1) {
      option.xAxis[0].data = item.question.answer.split("|");
      var answerCounts = {};
      item.answers.forEach(function (answer) {
        const userAnswers = answer.content.split("|");
        userAnswers.forEach((userAnswer) => {
          if (!answerCounts[userAnswer]) {
            answerCounts[userAnswer] = 0;
          }
          answerCounts[userAnswer]++;
        });
      });
      option.series[0].data = option.xAxis[0].data.map(function (answerOption) {
        return answerCounts[answerOption] || 0;
      });
    }

    if (item.question.type === 3) {
      option.xAxis[0].data = ["< 1", "1 - 2", "2 - 3", "3 - 4", "4 - 5"];
      var answerCounts = {};
      item.answers.forEach(function (answer) {
        let rating = parseFloat(answer.content);
        let category;
        if (rating < 1) {
          category = "< 1";
        } else if (rating < 2) {
          category = "1 - 2";
        } else if (rating < 3) {
          category = "2 - 3";
        } else if (rating < 4) {
          category = "3 - 4";
        } else {
          category = "4 - 5";
        }
        if (!answerCounts[category]) {
          answerCounts[category] = 0;
        }
        answerCounts[category]++;
      });
      option.series[0].data = option.xAxis[0].data.map(function (answerOption) {
        return answerCounts[answerOption] || 0;
      });
    }
    return option;
  }

  fetchData() {
    this.allQuestionsAndAnswers = this.feedbackService
      .getAllQuestionsByEventId(this.event.id)
      .pipe(
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
                  }),
                }))
              )
            )
          )
        )
      );
    this.allQuestionsAndAnswers.subscribe(
      (items) => (this._allQuestionsAndAnswers = items)
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

  // exportData() {
  //   this.chartInstances.forEach(chart => {
  //     let img = new Image();
  //     img.src = chart.getDataURL({
  //         pixelRatio: 2,
  //         backgroundColor: '#fff'
  //     });
  //     console.log(img.src)
  //   })
  // }

  exportToExcel() {
    // ✔
    let rows = [];
    rows.push({});
    rows.push({
      ROLLNUMBER: "",
      NAME: this.event.title.toUpperCase() + ' - STATISTIC',
    });
    rows = rows.concat([
      {},
      {
        ROLLNUMBER: "Title",
        NAME: this.event.title,
      },
      {
        ROLLNUMBER: "Status",
        NAME: this.event.status === 0 ? 'Un-public' : this.event.status === 1 ? 'Public' : this.event.status === 2 ? 'Draft' : 'Completed',
      },
      {
        ROLLNUMBER: "Event Leader",
        NAME: this.event.eventLeader.name + ' - ' + this.event.eventLeader.rollnumber,
      },
      {
        ROLLNUMBER: "Start time",
        NAME: convertMilliToDate(this.event.startTime),
        CHECKIN: "Duration",
        CHECKOUT: convertMillisToTime(this.event.duration).hours + ' hours ' + convertMillisToTime(this.event.duration).minutes + ' minutes'
      },
      {}
    ])

    rows = rows.concat([
      {
        ROLLNUMBER:
          "---------------------------------------------------------------------------------------------------------------",
        NAME: "---------------------------------------------------------------------------------------------------------------",
        CHECKIN:
          "---------------------------------------------------------------------------------------------------------------",
        CHECKOUT:
          "---------------------------------------------------------------------------------------------------------------",
      },
      { NAME: 'PARTICIPANTS' }, {},
      {
        ROLLNUMBER: "ROLLNUMBER",
        NAME: "NAME",
        CHECKIN: "CHECKIN",
        CHECKOUT: "CHECKOUT",
      },
      {},
    ]);

    let participantRows = this.participants.map((participant) => {
      return {
        ROLLNUMBER: participant.user.rollnumber,
        NAME: participant.user.name,
        CHECKIN: participant.checkin ? "✔" : participant.checkout ? "✔" : "",
        CHECKOUT: participant.checkout ? "✔" : "",
      };
    });
    rows = rows.concat(participantRows).concat([{}, {}]);

    rows = rows.concat([
      {
        ROLLNUMBER:
          "---------------------------------------------------------------------------------------------------------------",
        NAME: "---------------------------------------------------------------------------------------------------------------",
        CHECKIN:
          "---------------------------------------------------------------------------------------------------------------",
        CHECKOUT:
          "---------------------------------------------------------------------------------------------------------------",
      },
    ], { NAME: 'FEEDBACK' }, {});

    rows.push({ ROLLNUMBER: "ANSWERS", NAME: 'COUNT', CHECKIN: "PERCENTAGE (%)", });
    rows = rows.concat([{}]);

    this._allQuestionsAndAnswers.forEach((qna) => {
      rows.push({ ROLLNUMBER: "QUESTION", NAME: qna.question.question });
      if (
        qna.question.type === 0 ||
        qna.question.type === 1 ||
        qna.question.type === 3
      ) {
        for (let i = 0; i < qna.chart.series[0].data.length; i++) {
          rows.push({
            ROLLNUMBER: qna.chart.xAxis[0].data[i],
            NAME: qna.chart.series[0].data[i],
            CHECKIN: +(
              (qna.chart.series[0].data[i] / qna.chart.series[0].data.length) *
              100
            ).toFixed(2),
          });
        }
        if (qna.question.type === 3) {
          const sumRating = qna.answers.reduce(
            (a, b) => a + Number(b.content),
            0
          );
          const avgRating = +(sumRating / qna.answers.length).toFixed(2);

          rows.push({ ROLLNUMBER: "", NAME: "AVERAGE", CHECKIN: avgRating });
        }
      }
      if (qna.question.type === 2) {
        qna.answers.forEach((item) => {
          rows.push({ ROLLNUMBER: item.content });
        });
      }
      rows = rows.concat([{}]);
    });

    const ws = utils.json_to_sheet(rows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");

    if (!ws["!cols"]) ws["!cols"] = [];
    if (!ws["!cols"][0]) ws["!cols"][0] = { wch: 8 };
    ws["!cols"][0].wpx = 200;
    [1, 2, 3].map((col) => {
      if (!ws["!cols"][col]) ws["!cols"][col] = { wch: 8 };
      ws["!cols"][col].wpx = 100;
    });

    if (!ws["!rows"]) ws["!rows"] = [];
    if (!ws["!rows"][0]) ws["!rows"][0] = {};
    ws["!rows"][0].hidden = true;

    writeFileXLSX(wb, "SheetJSAngularAoO.xlsx");
  }
}
