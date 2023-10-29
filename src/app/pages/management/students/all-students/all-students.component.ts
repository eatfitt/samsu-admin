import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-all-students',
  templateUrl: './all-students.component.html',
  styleUrls: ['./all-students.component.scss']
})

// TODO: Thêm hình sinh viên thì tốt
export class AllStudentsComponent {
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      rollno: {
        title: 'Roll Number',
        type: 'string',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      dob: {
        title: 'DOB',
        type: 'string',
      },
    },
  };

  data = [
    {
      rollno: 'SE161779',
      name: 'Đỗ Ngân Hà',
      email: 'hadnse161779@fpt.edu.vn',
      username: 'elnganha',
      dob: '14/09/2001'
    },
    {
      rollno: 'SE151779',
      name: 'Nguyễn Trần Thiên Đức',
      email: 'duc79@fpt.edu.vn',
      username: 'ducduc',
      dob: '01/01/2001'
    },{
      rollno: 'SE151773',
      name: 'Trương Nguyễn Anh Huy',
      email: 'huy73@fpt.edu.vn',
      username: 'huyhuy',
      dob: '02/02/2001'
    },{
      rollno: 'SE161777',
      name: 'Thái Văn Mẫn',
      email: 'man77@fpt.edu.vn',
      username: 'manman',
      dob: '03/03/2001'
    },
  ]

  source: LocalDataSource | any = new LocalDataSource();

  constructor() {
    this.source.load(this.data);
    // this.source.setFilter([{field: 'rollno', search: '79'}, {field: 'name', search: 'ha'}, ])
  }

  importFromExcel(data: any[][]) {
    let mappedData = data.map(item => {
      return {
          rollno: item[0],
          name: item[1],
          email: item[2],
          username: item[3],
          dob: item[4] // you might need to convert this to a date format
      };
    });
    this.data.push(...mappedData);
    this.source.load(this.data);
  }
}
