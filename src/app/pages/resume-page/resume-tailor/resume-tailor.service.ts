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
  descriptions,
  emails,
  links,
  names,
  phones,
  skills,
  titles,
} from './data/resume-options.data';
import { startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResumeTailorService {
  formBuilder = inject(FormBuilder);

  resumeTailorForm = this.formBuilder.group({
    name: [names[0]],
    title: [titles[0]],
    links: [links],
    phone: [phones[0]],
    email: [emails[0]],
    description: [descriptions[0]],
    skills: [skills.slice(0, 10)],
    workExperiences: [workExperiences.slice(0, 2)],
    personalProjects: [[personalProjects[0]]],
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
    console.log(resume);
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
