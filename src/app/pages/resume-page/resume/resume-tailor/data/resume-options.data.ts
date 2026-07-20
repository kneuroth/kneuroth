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
  'Software Engineer with 3+ years of web development experience in the banking industry. I specialize in Angular and full-stack Typescript development. Highly skilled at engaging with stakeholders to understand business needs and converting them into effective solutions. I am looking for a driven team where I can contribute to performance, reliability, and user experience.',
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
    type: SkillType.Language,
  },
  {
    name: 'CSS',
    type: SkillType.Language,
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
    type: SkillType.Tech,
  },
  {
    name: 'Serverless Framework',
    type: SkillType.Tech,
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
    type: SkillType.Tech,
  },
  {
    name: 'AWS',
    type: SkillType.Tech,
  },
];

export const workExperienceOptions: WorkExperience[] = [
  {
    employer: 'M&T Bank',
    location: 'Buffalo, NY',
    title: 'Software Engineer',
    startDate: new Date(2022, 7, 1),
    endDate: 'Present',
    bullets: [
      'Deployed a full-stack Angular/Spring application for use by over 800 Financial Crimes and business users',
      'Built a unified data aggregation platform that centralized data access for investigators',
      'Engineered 20+ quality-of-life features with direct stakeholder engagement',
      'Built CI/CD pipelines for 4 full-stack applications with 20+ automated jobs which significantly reduced developer friction',
      'Created internal tooling to assist in user acceptance testing',
    ],
  },
  {
    employer: 'Munvo',
    location: 'Montreal, QC',
    title: 'Software Consultant',
    startDate: new Date(2021, 9, 1),
    endDate: new Date(2022, 6, 1),
    bullets: [
      'Migrated 100s of marketing campaign files across dev, cert, and production environments for casino client',
      'Led weekly stakeholder calls over 3-month engagement to coordinate Adobe Marketing Cloud platform upgrade',
      'Executed server-side deployments via SSH, ensuring zero data loss during migration',
    ],
  },
  {
    employer: 'IBM Canada',
    location: 'Markham, ON',
    title: 'Software Engineering Intern',
    startDate: new Date(2019, 10, 1),
    endDate: new Date(2020, 10, 1),
    bullets: [
      'Developed frontend features using Vue.js framework',
      'Conducted direct user interviews to understand pain points and workflow challenges',
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
      'Serverless Framework (AWS Lambda Functions running Typescript) re-design in progress.',
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
