// TODO Future: Replace with api service call
import {
  Education,
  PersonalProject,
  SkillType,
  WorkExperience,
} from '@app/pages/resume-page/resume/resume.model';

export const nameOptions = ['Kelly Neuroth'];
export const titleOptions = [
  'Software Engineer',
  'Software developer with 3+ years of engineering experience',
  'Software engineer with 3+ years of web development experience',
];

export const linkOptions = [
  'https://github.com/kneuroth',
  'https://kneuroth.github.io/kneuroth',
];

export const phones = ['518-915-8080'];
export const emails = ['kelly.neuroth@outlook.com'];
export const descriptionOptions = [
  "Software Engineer with 3+ years of web development experience in the banking industry. I specialize in Angular and full-stack Typescript development. Highly skilled at engaging with stakeholders to understand business needs and converting them into effective solutions. I am looking for a driven team where I can contribute to performance, reliability, and user experience.",
  "Canadian Software Engineer with 3+ years of experience building secure and scalable web applications in the banking industry. I specialize in Angular and full-stack Typescript development. My goal is to relocate to San Diego through a TN Visa opportunity . I care about building reliable, user-experience-focused systems. I'm looking to join a team where I can contribute to performance, reliablitiy, and user experience.",
  "I'm a software engineer interested in designing creative solutions to unique problems. I currently work in the web development domain, have strong frontend skills in the latest Angular version (19), and a sturdy fountation and understanding of backend tech and infrastructure. I like to stay informed on new technology and best engineering standards. I am looking for interesting opportunities that I can feel good contributing to.",
];
export const skillOptions = [
  {
    name: 'Typescript',
    type: SkillType.Language,
  },
  {
    name: 'Javscript',
    type: SkillType.Language
  },
  {
    name: 'CSS',
    type: SkillType.Language
  },
  {
    name: 'Bash (shell scripting)',
    type: SkillType.Language,
  },
  {
    name: 'Java',
    type: SkillType.Language,
  },
  {
    name: 'SQL',
    type: SkillType.Language,
  },
  {
    name: 'Angular',
    type: SkillType.Tech,
  },
  {
    name: 'Node.js',
    type: SkillType.Tech
  },
  {
    name: 'Serverless Framework',
    type: SkillType.Tech
  },
  {
    name: 'Spring / Springboot',
    type: SkillType.Tech,
  },
  {
    name: 'Linux RHEL',
    type: SkillType.Tech,
  },
  { name: 'Docker', type: SkillType.Tech },
  {
    name: 'Gitlab CI/CD',
    type: SkillType.Tech,
  },
  {
    name: 'OAuth',
    type: SkillType.Tech,
  },
  {
    name: 'Postman',
    type: SkillType.Tech,
  },
  {
    name: 'Openshift',
    type: SkillType.Tech
  },
  {
    name: 'AWS',
    type: SkillType.Tech
  }
];

export const workExperienceOptions: WorkExperience[] = [
  {
    employer: 'M&T Bank',
    location: 'Buffalo, NY',
    title: 'Software Engineer',
    startDate: new Date(2021, 7, 1),
    endDate: 'Present',
    bullets: [
      'Engineered and demonstrated 20+ new features with direct and ongoing stakeholder engagement to drive efficiencies',
      'Deployed a full-stack Angular/Spring application for use by over 800 Financial Crimes and business users',
      'Refactored application from Angular v17 to Angular v19 and reduced lines of code by 60%',
      'Built custom CI/CD pipelines',
      'Deployed custom data monitoring python scripts to monitor over 15 table batch loads with <10 minute response time',],
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

export const personalProjectOptions: PersonalProject[] = [
  {
    name: 'Telegram Messaging App Wordle Bot',
    description:
      "A bot on the Telegram messaging app that tracks a groupchat's wordle scores via user submissions",
    bullets: [
      'Automated score tracking for Wordle players in a group chat',
      'Harnessed python libraries, the Telegram Bot API, and SQLLite database to create a seamless user experience',
      'Hosted on VM in Google Cloud Platform',
      'Serverless Framework (AWS Lambda Functions running Typescript) re-design in progress.'
    ],
    link: 'https://github.com/kneuroth/wordle-telegram-bot',
  },
];

export const educationOptions: Education[] = [
  {
    name: 'University of Western Ontario',
    degree: 'Software Engineering',
    startDate: new Date(2016, 10, 1),
    endDate: new Date(2021, 5, 1),
  },
];
