import { WorkExperience } from './work-experience.model';

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
