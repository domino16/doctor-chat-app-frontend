
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'dateToTimestamp'
})
export class DateToTimestamp implements PipeTransform {

  transform(value: Date):number {
     return new Date(value).getTime()

  }

}
