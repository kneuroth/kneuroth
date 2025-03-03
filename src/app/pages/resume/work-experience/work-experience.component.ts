import { Component, computed, input } from '@angular/core';
import { Panel } from 'primeng/panel';
import { WorkExperience } from './work-experience.model';
import { DatePipe } from '@angular/common';
import { ConditionalDatePipe } from '../../../shared/pipes/conditional-date.pipe';

@Component({
  selector: 'app-work-experience',
  imports: [Panel, ConditionalDatePipe],
  templateUrl: './work-experience.component.html',
})
export class WorkExperienceComponent {
  workExperience = input.required<WorkExperience>();

  employer = computed(() => this.workExperience().employer);
  startDate = computed(() => this.workExperience().startDate);
  endDate = computed(() => this.workExperience().endDate);
}
