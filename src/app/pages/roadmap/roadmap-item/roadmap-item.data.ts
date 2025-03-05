import {
  RoadmapItem,
  RoadmapItemType,
  RoadmapItemStatus,
} from './roadmap-item.model';

export const roadmapItems: RoadmapItem[] = [
  {
    name: 'Resume',
    description:
      'Create the resume page plus a nice looking resume. Allow downloading as pdf (free of charge)',
    type: RoadmapItemType.Feature,
    status: RoadmapItemStatus.InProgress,
    link: '/resume',
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
    name: 'Resume bullets lists',
    description: 'Resume is missing nice bullets',
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
    name: 'Identify Roadmap Item Types',
    description:
      'Add a UI feature that utilizes RoadmapItemTypes to identify if a RoadmapItem is a Bug, Feature, Enhancement or other type of roadmap item.',
    type: RoadmapItemType.Enhancement,
    status: RoadmapItemStatus.Done,
    link: undefined,
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
