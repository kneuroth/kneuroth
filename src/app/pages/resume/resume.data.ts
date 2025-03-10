import {
  Education,
  PersonalProject,
  SkillType,
  WorkExperience,
} from './resume.model';
import { Resume } from './resume.model';

export const workExperiences: WorkExperience[] = [
  {
    employer: 'M&T Bank',
    location: 'Buffalo, NY',
    title: 'Software Engineer I',
    startDate: new Date(2021, 7, 1),
    endDate: 'Present',
    bullets: [
      'Built and grew full-stack data viewing and internal actioning application to over 400 concurrent users',
    ],
  },
  {
    employer: 'Munvo',
    location: 'Montreal, QC',
    title: 'Software Consultant',
    startDate: new Date(2020, 9, 1),
    endDate: new Date(2021, 6, 1),
    bullets: ['Got learned on SAS'],
  },
];

export const personalProjects: PersonalProject[] = [
  {
    name: 'Telegram Messaging App Wordle Bot',
    description:
      "A bot on the Telegram messaging app that tracks a groupchat's wordle scores via user submissions",
    bullets: [
      'Used python to build rest endpoints',
      "Learned telegram's API service to parse user messages",
      'Inserted scores into SQLLite database',
      'Hosted with Google Cloud Platform',
    ],
    link: 'https://github.com/kneuroth/wordle-telegram-bot',
  },
];

export const education: Education[] = [
  {
    name: 'University of Western Ontario',
    degree: 'Software Engineering',
    startDate: new Date(2016, 10, 1),
    endDate: new Date(2021, 5, 1),
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
  skills: [
    {
      name: 'Object oriented design',
      type: SkillType.Skill,
    },
    {
      name: 'Web architecture',
      type: SkillType.Skill,
    },
    {
      name: 'User-centered design',
      type: SkillType.Skill,
    },
    {
      name: 'REST design',
      type: SkillType.Skill,
    },
    {
      name: 'Microservice design',
      type: SkillType.Skill,
    },
    {
      name: 'Containerization',
      type: SkillType.Skill,
    },
    {
      name: 'Javascript / HTML / CSS',
      type: SkillType.Language,
    },
    {
      name: 'Bash (shell scripting)',
      type: SkillType.Language,
    },
    {
      name: 'Java, Python, SQL',
      type: SkillType.Language,
    },
    {
      name: 'Angular / PrimeNG / Tailwindcss',
      type: SkillType.Tech,
    },
    {
      name: 'Spring / Springboot / Snowflake',
      type: SkillType.Tech,
    },
    {
      name: 'Linux RHEL / Docker / Gitlab Pipelines / Google Cloud Platform',
      type: SkillType.Tech,
    },
  ],
  workExperiences: workExperiences,
  personalProjects: personalProjects,
  education: education,
};
