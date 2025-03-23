import {
  Skill,
  WorkExperience,
  PersonalProject,
  Education,
} from '@app/resume/resume.model';

export type ResumeOptions = {
  names: string[];
  titles: string[];
  links: string[];
  phones: string[];
  emails: string[];
  descriptions: string[];
  skills: Skill[];
  workExperiences: WorkExperience[];
  personalProjects?: PersonalProject[];
  educations?: Education[];
};
