import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'placeholder',
})
export class PlaceholderPipe implements PipeTransform {

  transform(value: string, defaultText: string = 'Any text') {

    return value ? value : defaultText;

  }
}
