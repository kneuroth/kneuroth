export type Resume = {
  name: string;
  title: string;
  links: string[];
  phone: string;
  email: string;
  description: string;
  skills: Skill[];
  workExperiences: WorkExperience[];
};

export enum SkillType {
  Skill = 'Skill',
  Tech = 'Tech',
  Soft = 'Soft',
  Language = 'Language',
}

export type Skill = {
  name: string;
  type: SkillType;
};

export type WorkExperience = {
  employer: string;
  location: string;
  startDate: Date;
  endDate: Date | 'Present' | 'Ongoing';
  bullets: string[];
};
