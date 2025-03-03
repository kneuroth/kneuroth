import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'conditionalDate',
})
export class ConditionalDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-US');

  transform(value: unknown, format = 'shortDate'): string {
    if (value instanceof Date) {
      return this.datePipe.transform(value, format) ?? '';
    } else {
      return String(value); // e.g. 'Present'
    }
  }
}
