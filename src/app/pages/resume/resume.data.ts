import { WorkExperience } from './resume.model';
import { Resume } from './resume.model';

export const workExperience: WorkExperience[] = [
  {
    employer: 'M&T Bank',
    location: 'Buffalo, NY',
    startDate: new Date(2021, 7, 1),
    endDate: 'Present',
    bullets: [
      'Built and grew full-stack data viewing and internal actioning application to over 400 concurrent users',
    ],
  },
  {
    employer: 'Munvo',
    location: 'Montreal, QC',
    startDate: new Date(2020, 9, 1),
    endDate: new Date(2021, 6, 1),
    bullets: ['Got learned on SAS'],
  },
];

export const resume: Resume = {
  name: 'Kelly Neuroth',
  title: 'Software Engineer',
  links: ['https://github.com/kneuroth'],
  email: 'kelly.neuroth@outlook.com',
  phone: '518-915-8080',
  description:
    'Lots of words here to describe the type of guy and person and person i am i want a job so badly please please pelasepleas',
  skills: [],
  workExperiences: workExperience,
};
