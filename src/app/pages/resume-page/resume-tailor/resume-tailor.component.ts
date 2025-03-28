import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ResumeTailorService } from './resume-tailor.service';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';
import { Select } from 'primeng/select';
import { IftaLabel } from 'primeng/iftalabel';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  titleOptions,
  linkOptions,
  descriptionOptions,
  skillOptions,
  workExperienceOptions,
  personalProjectOptions,
  educationOptions,
} from './data/resume-options.data';

@Component({
  selector: 'app-resume-tailor',
  imports: [ReactiveFormsModule, FormsModule, Select, IftaLabel, MultiSelect],
  templateUrl: './resume-tailor.component.html',
})
export class ResumeTailorComponent {
  tailorService = inject(ResumeTailorService);

  form = this.tailorService.resumeTailorForm;

  titles = titleOptions;
  links = linkOptions;
  descriptions = descriptionOptions;
  skills = skillOptions;
  workExperiences = workExperienceOptions;
  personalProjects = personalProjectOptions;
  educations = educationOptions;
}
