export type WorkExperience = {
  employer: string;
  location: string;
  startDate: Date;
  endDate: Date | 'Present' | 'Ongoing';
  bullets: string[];
};
