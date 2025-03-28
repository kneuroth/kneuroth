import {
  RoadmapItem,
  RoadmapItemType,
  RoadmapItemStatus,
} from './roadmap-item.model';

export const roadmapItems: RoadmapItem[] = [
  {
    name: 'Customizable Resume',
    description:
      'Give user control of what data is displayed on the resume. Allow them to select from a pool of all of your skills, educations, work experiences, personal projects. Apply the results and then the user can export the PDF.',
    type: RoadmapItemType.Feature,
    status: RoadmapItemStatus.InProgress,
    link: undefined,
  },
  {
    name: 'More personal home page',
    description:
      'Add your own photos and a personal statement to the home page',
    type: RoadmapItemType.Enhancement,
    status: RoadmapItemStatus.InProgress,
  },
  {
    name: 'Resume Tailor - Add a summary to description options',
    description:
      'Its ugly to see the entire description in the dropwdown in the resume tailor - add a model to represent a description option and give it a summary field to summarize the value of the description and display that so it doesnt bog down the dropdown item.',
    type: RoadmapItemType.Enhancement,
    status: RoadmapItemStatus.Backlog,
  },
  {
    name: 'Resume Tailor - Make skill type identifier in skills dropdown',
    description:
      'It would be nice to be able to see skill type in the drop down for the resume tailor feature. Use ng-templating to show icons for skill types in the option.',
    type: RoadmapItemType.Enhancement,
    status: RoadmapItemStatus.Backlog,
  },
  {
    name: 'Add "Projects" page',
    description:
      'Add a page to display and link various personal projects, sorted by type',
    type: RoadmapItemType.Feature,
    status: RoadmapItemStatus.Backlog,
  },

  {
    name: 'Sort Roadmap',
    description:
      'Add date started and date completed fields to RoadmapItem plus implement a sorting function. Group sorted items by status also.',
    type: RoadmapItemType.Enhancement,
    status: RoadmapItemStatus.Backlog,
    link: undefined,
  },

  {
    name: 'Backendify Resume',
    description:
      'Create a backend that stores resume items like work experience and other personal information.',
    type: RoadmapItemType.Enhancement,
    status: RoadmapItemStatus.Backlog,
    link: undefined,
  },
  {
    name: 'Personalize header and side menu',
    description: "They're kinda boring",
    type: RoadmapItemType.Enhancement,
    status: RoadmapItemStatus.Done,
  },
  {
    name: 'Resume bullets lists',
    description: 'Resume is missing nice bullets',
    type: RoadmapItemType.Enhancement,
    status: RoadmapItemStatus.Done,
    link: undefined,
  },
  {
    name: 'Remove p-cards from resume',
    description:
      'P cards are too big and hard to customize. Get em out of the resume to you can fine tune and make the whole thing more dense',
    type: RoadmapItemType.Enhancement,
    status: RoadmapItemStatus.Done,
  },
  {
    name: 'Identify Roadmap Item Types',
    description:
      'Add a UI feature that utilizes RoadmapItemTypes to identify if a RoadmapItem is a Bug, Feature, Enhancement or other type of roadmap item.',
    type: RoadmapItemType.Enhancement,
    status: RoadmapItemStatus.Done,
    link: undefined,
  },
  {
    name: 'Resume',
    description:
      'Create the resume page plus a nice looking resume. Allow downloading as pdf (free of charge)',
    type: RoadmapItemType.Feature,
    status: RoadmapItemStatus.Done,
    link: '/resume',
  },
  {
    name: 'Roadmap',
    description:
      'Create a roadmap page that tracks upcoming features and bugs on this site.',
    type: RoadmapItemType.Feature,
    status: RoadmapItemStatus.Done,
    link: '/roadmap',
  },
  {
    name: 'Title Component',
    description:
      'Create a general title component that can be used across pages.',
    type: RoadmapItemType.Feature,
    status: RoadmapItemStatus.Done,
    link: undefined,
  },
];
