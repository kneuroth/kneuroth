import { Injectable, signal } from '@angular/core';
import { defaultResume } from '@app/resume/resume.data';
import { Resume } from '@app/resume/resume.model';

@Injectable({
  providedIn: 'root',
})
export class ResumeTailorService {
  constructor() {}

  resume = signal<Resume>(defaultResume);
}
