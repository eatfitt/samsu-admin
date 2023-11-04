import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { WorkBook, WorkSheet, read, utils, writeFileXLSX } from "xlsx";


@Component({
  selector: "ngx-excel-importer",
  template: `

      <nb-card>
        <nb-card-header>
          <div class="d-flex justify-content-between">
            <div>{{ buttonText }}</div>
            <a class="small" target="_blank" [href]="sampleData">Sample Data</a>
          </div>
        </nb-card-header>
        <nb-card-body class="bg-white">
          <input
            type="file"
            (change)="onFileChange($event)"
            multiple="false"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </nb-card-body>
      </nb-card>
    <!-- <table class="sjs-table">
      <tr *ngFor="let row of data">
        <td *ngFor="let val of row">{{ val }}</td>
      </tr>
    </table> -->
    <!-- <div class="content" role="main">
      <table>
        <thead>
          <th>Name</th>
          <th>Index</th>
        </thead>
        <tbody>
          <tr *ngFor="let row of rows">
            <td>{{ row.Name }}</td>
            <td>{{ row.Index }}</td>
          </tr>
        </tbody>
        <tfoot>
          <button (click)="onSave()">Export XLSX</button>
        </tfoot>
      </table>
    </div> -->
  `,
  styleUrls: ["./excel-importer.component.scss"],
})
export class ExcelImporterComponent {
  // rows: President[] = [{ Name: "SheetJS", Index: 0 }];
  @Input() sampleData = "https://sgp1.digitaloceanspaces.com/samsu/assets/50b73f64-a966-4729-9560-c1650be98774_SAMSUUserImportExample.xlsx";
  @Input() buttonText = 'Import';
  @Output() importFromExcel: EventEmitter<any[][]> = new EventEmitter<
    any[][]
  >();
  @ViewChild("importDialog", { static: true }) importDialog: TemplateRef<any>;

  data: any[][] = [];

  // ngOnInit(): void {
  //   (async () => {
  //     const f = await fetch(
  //       "https://sgp1.digitaloceanspaces.com/samsu/assets/50b73f64-a966-4729-9560-c1650be98774_SAMSUUserImportExample.xlsx"
  //     );
  //     const ab = await f.arrayBuffer();

  //     /* parse workbook */
  //     const wb = read(ab);

  //     /* update data */
  //     this.rows = utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]]);
  //   })();
  // }

  /* get state data and export to XLSX */
  // onSave(): void {
  //   const ws = utils.json_to_sheet(this.rows);
  //   const wb = utils.book_new();
  //   utils.book_append_sheet(wb, ws, "Data");
  //   writeFileXLSX(wb, "SheetJSAngularAoO.xlsx");
  // }

  constructor(
    public toastrService: NbToastrService,
    private dialogService: NbDialogService
  ) {}


  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    if (
      target.files[0].type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      this.toastrService.show(
        "You must import type xlxs/excel",
        `Import fail`,
        { status: "danger" }
      );
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const ab: ArrayBuffer = e.target.result;
      const wb: WorkBook = read(ab);

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <any[][]>utils.sheet_to_json(ws, { header: 1 });
      this.importFromExcel.emit(this.data);
    };
    reader.readAsArrayBuffer(target.files[0]);
    evt.target.value = "";
  }
}
