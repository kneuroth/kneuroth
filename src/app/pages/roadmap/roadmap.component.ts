import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoadmapItemComponent } from './roadmap-item/roadmap-item.component';
import {
  RoadmapItem,
  RoadmapItemStatus,
  RoadmapItemType,
} from './roadmap.constants';

@Component({
  selector: 'app-roadmap',
  imports: [FormsModule, RoadmapItemComponent],
  templateUrl: './roadmap.component.html',
})
export class RoadmapComponent {
  roadmapItems: RoadmapItem[] = [
    {
      name: 'Resume',
      description:
        'Create the resume page. Make it available for download as a pdf.',
      type: RoadmapItemType.Feature,
      status: RoadmapItemStatus.InProgress,
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
      name: 'Sort Roadmap',
      description:
        'Add date started and date completed fields to RoadmapItem plus implement a sorting function. Group sorted items by type also.',
      type: RoadmapItemType.Feature,
      status: RoadmapItemStatus.Backlog,
      link: undefined,
    },
  ];
}
