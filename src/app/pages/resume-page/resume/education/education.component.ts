import { Component, computed, input } from '@angular/core';
import { Education } from '../resume.model';
import { ConditionalDatePipe } from '../../../../shared/pipes/conditional-date.pipe';
import { InnerGlassPanelComponent } from '@shared/ui/inner-glass-panel/inner-glass-panel.component';

@Component({
  selector: 'app-education',
  imports: [ConditionalDatePipe, InnerGlassPanelComponent],
  templateUrl: './education.component.html',
})
export class EducationComponent {
  education = input.required<Education>();

  name = computed(() => this.education().name);
  degree = computed(() => this.education().degree);
  startDate = computed(() => this.education().startDate);
  endDate = computed(() => this.education().endDate);
}
