import { Component } from '@angular/core';
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
      type: RoadmapItemType.Bug,
      status: RoadmapItemStatus.InProgress,
      link: '/resume',
    },
  ];
}
