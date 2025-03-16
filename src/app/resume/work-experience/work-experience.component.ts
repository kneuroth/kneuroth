import { Component, computed, input } from '@angular/core';
import { Panel } from 'primeng/panel';
import { WorkExperience } from '../resume.model';
import { ConditionalDatePipe } from '../../shared/pipes/conditional-date.pipe';

@Component({
  selector: 'app-work-experience',
  imports: [ConditionalDatePipe],
  templateUrl: './work-experience.component.html',
})
export class WorkExperienceComponent {
  workExperience = input.required<WorkExperience>();

  employer = computed(() => this.workExperience().employer);
  location = computed(() => this.workExperience().location);
  title = computed(() => this.workExperience().title);
  startDate = computed(() => this.workExperience().startDate);
  endDate = computed(() => this.workExperience().endDate);
  bullets = computed(() => this.workExperience().bullets);
}
