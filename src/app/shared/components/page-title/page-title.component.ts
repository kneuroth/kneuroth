import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-title',
  imports: [],
  templateUrl: './page-title.component.html',
})
export class PageTitleComponent {
  title = input.required();
  subtitle = input('');
}
