import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Resume } from '@app/resume/resume.model';
import { FormBuilder } from '@angular/forms';
import {
  defaultResume,
  education,
  personalProjects,
  workExperiences,
} from '@app/resume/resume.data';
import {
  descriptionOptions,
  emails,
  linkOptions,
  nameOptions,
  phones,
  skillOptions,
  titleOptions,
  workExperienceOptions,
  personalProjectOptions,
} from './data/resume-options.data';
import { startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResumeTailorService {
  formBuilder = inject(FormBuilder);

  resumeTailorForm = this.formBuilder.group({
    name: [nameOptions[0]],
    title: [titleOptions[0]],
    links: [linkOptions],
    phone: [phones[0]],
    email: [emails[0]],
    description: [descriptionOptions[0]],
    skills: [skillOptions.slice(0, 10)],
    workExperiences: [workExperienceOptions.slice(0, 2)],
    personalProjects: [[personalProjectOptions[0]]],
    educations: [[education[0]]],
  });

  // formChanges = toSignal(this.resumeTailorForm.valueChanges);

  formSignal = toSignal(
    this.resumeTailorForm.valueChanges.pipe(
      startWith(this.resumeTailorForm.getRawValue()),
    ),
  );

  resume = computed((): Resume => {
    let resume = this.formSignal();
    return {
      name: resume?.name || '',
      title: resume?.title || '',
      links: resume?.links || [],
      phone: resume?.phone || '',
      email: resume?.email || '',
      description: resume?.description || '',
      skills: resume?.skills || [],
      workExperiences: resume?.workExperiences || [],
      personalProjects: resume?.personalProjects || [],
      education: resume?.educations || [],
    };
  });

  // resume = signal<Resume>(defaultResume);
}
