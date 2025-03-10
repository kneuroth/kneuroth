export type Resume = {
  name: string;
  title: string;
  links: string[];
  phone: string;
  email: string;
  description: string;
  skills: Skill[];
  workExperiences: WorkExperience[];
  personalProjects?: PersonalProject[];
  education?: Education[];
};

export enum SkillType {
  Skill = 'General Skills',
  Tech = 'Tech',
  Soft = 'Soft Skills',
  Language = 'Languages',
}

export type Skill = {
  name: string;
  type: SkillType;
};

export type WorkExperience = {
  employer: string;
  location: string;
  title: string;
  startDate: Date;
  endDate: Date | 'Present' | 'Ongoing';
  bullets: string[];
};

export type PersonalProject = {
  name: string;
  description?: string;
  bullets: string[];
  link?: string;
};

export type Education = {
  name: string;
  degree: string;
  startDate: Date;
  endDate: Date | 'Present' | 'Ongoing';
};
