import { Pipe, PipeTransform } from '@angular/core';
import DateParser from 'node-date-parser';
import NodeDateParser from 'node-date-parser';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {
  private parser: DateParser;

  constructor() {
    this.parser = new DateParser();
  }

  transform(value: number, ...args: unknown[]): unknown {
    return this.parser.parse('Y-m-d H:i:s', new Date(value));
  }

}
