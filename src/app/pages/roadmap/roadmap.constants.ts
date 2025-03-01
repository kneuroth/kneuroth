export enum RoadmapItemType {
  Bug,
  Feature,
}

export enum RoadmapItemStatus {
  Done = 'Done',
  InProgress = 'In Progress',
  Backlog = 'Backlog',
}

export type RoadmapItem = {
  name: string;
  description: string;
  type: RoadmapItemType;
  status: RoadmapItemStatus;
  link: string | undefined;
};
