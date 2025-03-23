import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Resume } from '@app/resume/resume.model';
import { of } from 'rxjs';
import { RESUME_OPTIONS } from './resume-tailor.data';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ResumeTailorService {
  formBuilder = inject(FormBuilder);

  resumeOptions = RESUME_OPTIONS;
  // rxResource({
  //   loader: () => of(RESUME_OPTIONS),
  // });

  resumeTailorForm = this.formBuilder.group({
    name: [''],
    title: [''],
    links: [''],
    phone: [''],
    email: [''],
    description: [''],
    skills: [''],
    workExperiences: [''],
    personalProjects: [''],
    educations: [''],
  });

  // resume = signal<Resume>(defaultResume);
  formChanges = toSignal(this.resumeTailorForm.valueChanges);

  resume = computed(() => {
    let changes = this.formChanges();
    return {
      name: 'Kelly Neuroth',
      title: 'Software Engineer',
      links: [],
      phone: '',
      email: '',
      description: this.formChanges()?.description || '',
      skills: [],
      workExperiences: [],
    };
  });

  descriptions = computed(() => this.resumeOptions.descriptions ?? []);

  // changeName() {
  //   this.resume.update((resume) => {
  //     return { ...resume, name: '123' };
  //   });
  // }
}
