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
    title: 'Contractor / Software Engineer I',
    startDate: new Date(2021, 7, 1),
    endDate: 'Present',
    bullets: [
      "Designed full-stack features in Spring/Angular for use by over 400 users in M&T's financial crimes department",
      'Successfully migrated application from Angular v17 to Angular v19',
      'Held design and pain point discovery sessions with business users',
      'Deployed custom data monitoring python scripts to monitor over 15 table batch loads with <10 minute response time',
    ],
  },
  {
    employer: 'Munvo',
    location: 'Montreal, QC',
    title: 'Software Consultant',
    startDate: new Date(2020, 9, 1),
    endDate: new Date(2021, 6, 1),
    bullets: [],
  },
  {
    employer: 'IBM Canada',
    location: 'Markham, ON',
    title: 'Intern',
    startDate: new Date(2019, 10, 1),
    endDate: new Date(2020, 10, 1),
    bullets: [
      'Built Vue.js app for asset visualizations for business',
      'Communicated with app users to create efficiencies in parts ordering process',
    ],
  },
];

export const personalProjects: PersonalProject[] = [
  {
    name: 'Telegram Messaging App Wordle Bot',
    description:
      "A bot on the Telegram messaging app that tracks a groupchat's wordle scores via user submissions",
    bullets: [
      'Telegram (messaging app) API Bot connected to a python flask application',
      'REST API to transact and store scores in SQLLite database',
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

export const defaultResume: Resume = {
  name: 'Kelly Neuroth',
  title: 'Software Engineer',
  links: ['https://github.com/kneuroth'],
  email: 'kelly.neuroth@outlook.com',
  phone: '518-915-8080',
  description:
    "I'm a software engineer interested in designing creative solutions to unique problems. I currently work in the web development domain, have strong frontend skills in the latest Angular version (19), and a sturdy fountation and understanding of backend tech and infrastructure. I like to stay informed on new technology and best engineering standards. I am looking for interesting opportunities that I can feel good contributing to.",
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
      name: 'Agile practices / SCRUM',
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
      name: 'Linux RHEL / Docker',
      type: SkillType.Tech,
    },
    {
      name: 'Gitlab Pipelines / Google Cloud Platform',
      type: SkillType.Tech,
    },
  ],
  workExperiences: workExperiences,
  personalProjects: personalProjects,
  education: education,
};
