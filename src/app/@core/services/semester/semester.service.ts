import { Injectable } from '@angular/core';
export interface Semester {
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class SemesterService {

  constructor() { }
}
