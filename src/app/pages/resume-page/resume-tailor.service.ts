import { Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { defaultResume } from '@app/resume/resume.data';
import { Resume } from '@app/resume/resume.model';

@Injectable({
  providedIn: 'root',
})
export class ResumeTailorService {
  constructor() {}

  resume = signal<Resume>(defaultResume);

  changeName() {
    this.resume.update((resume) => {
      return { ...resume, name: '123' };
    });
  }
}
