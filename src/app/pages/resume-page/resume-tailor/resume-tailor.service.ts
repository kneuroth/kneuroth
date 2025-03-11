import { Injectable, signal } from '@angular/core';
import { defaultResume } from '@app/resume/resume.data';
import {
  Education,
  PersonalProject,
  Resume,
  Skill,
  SkillType,
  WorkExperience,
} from '@app/resume/resume.model';

@Injectable({
  providedIn: 'root',
})
export class ResumeTailorService {
  constructor() {}

  resume = signal<Resume>(defaultResume);

  aboutMes: string[] = ['A', 'B'];
  skills: Skill[] = [
    {
      name: 'Nunchucks',
      type: SkillType.Skill,
    },
  ];
  workExperiences: WorkExperience[] = [
    {
      employer: 'McDonalds',
      location: 'Canada',
      title: 'Burger Flipper',
      startDate: new Date(),
      endDate: new Date(),
      bullets: ['Flipped burgers'],
    },
  ];
  personalProjets: PersonalProject[] = [
    {
      name: 'Resume Tailor',
      bullets: ['Made in Angular'],
    },
  ];
  educations: Education[] = [
    {
      name: 'High school',
      degree: 'Piece of paper',
      startDate: new Date(),
      endDate: new Date(),
    },
  ];

  changeName() {
    this.resume.update((resume) => {
      return { ...resume, name: '123' };
    });
  }
}
