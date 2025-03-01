export enum RoadmapItemType {
  Bug,
  Feature,
}

export enum RoadmapItemStatus {
  Done,
  InProgress,
  Backlog,
}

export type RoadmapItem = {
  title: string;
  description: string;
  type: RoadmapItemType;
  status: RoadmapItemStatus;
};
