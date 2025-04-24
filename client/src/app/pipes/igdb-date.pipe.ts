import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';

@Pipe({
  name: 'igdbDate',
})
export class IgdbDatePipe implements PipeTransform {
  transform(value: number, fmt: string = 'yyyy-MM-dd HH:mm'): string {
    return format(new Date(value * 1000), fmt);
  }
}
