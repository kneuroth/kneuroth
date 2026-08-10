import { Component, computed, input } from '@angular/core';
import { WorkExperience } from '../resume.model';
import { ConditionalDatePipe } from '../../../../shared/pipes/conditional-date.pipe';
import { InnerGlassPanelComponent } from '@shared/ui/inner-glass-panel/inner-glass-panel.component';

@Component({
  selector: 'app-work-experience',
  imports: [ConditionalDatePipe, InnerGlassPanelComponent],
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
