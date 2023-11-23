import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'ngx-custom-autoselect',
  templateUrl: './custom-autoselect.component.html',
  styleUrls: ['./custom-autoselect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomAutoselectComponent {
  @ViewChild('autoInput') input;
  @Input() arr: any[] = [];
  @Input() property = '';
  @Input() label = '';
  @Input() placeholder = 'Enter value';
  @Output() selectItem = new EventEmitter<any>();
  @Output() filteredResult = new EventEmitter<any[]>();
  filteredArr = [];

  ngOnChanges(changes: SimpleChanges) {
    this.filteredArr = this.arr;
  }
  

  getFilteredOptions(value: string): any[] {
    return this.arr
      .filter(item => item[this.property].toLowerCase().includes(value.toLowerCase()));
  }

  onChange() {
    this.filteredArr = this.getFilteredOptions(this.input.nativeElement.value);
    this.filteredResult.emit(this.filteredArr);
  }

  handleSelect(event) {
    const selectedValue = this.arr.find(i => i[this.property] === event);
    this.selectItem.emit(selectedValue);
  }
  
}
