import { Component, computed, input } from '@angular/core';
import {
  RoadmapItem,
  RoadmapItemStatus,
  RoadmapItemType,
} from '../roadmap.constants';
import { Panel } from 'primeng/panel';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';

type TagSeverity =
  | 'success'
  | 'secondary'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast'
  | undefined;

@Component({
  selector: 'app-roadmap-item',
  imports: [Panel, Tag, Button],
  templateUrl: './roadmap-item.component.html',
})
export class RoadmapItemComponent {
  roadmapItem = input.required<RoadmapItem>();

  name = computed(() => this.roadmapItem().name);
  description = computed(() => this.roadmapItem().description);
  type = computed(() => this.roadmapItem().type);
  status = computed(() => this.roadmapItem().status);
  link = computed(() => this.roadmapItem().link);

  statusSeverity(status: RoadmapItemStatus): TagSeverity {
    switch (status) {
      case RoadmapItemStatus.Done:
        return 'success';
      case RoadmapItemStatus.InProgress:
        return 'info';
      case RoadmapItemStatus.Backlog:
        return 'secondary';
      default:
        return undefined;
    }
  }

  onClickLink(link: string) {
    window.location.href = link;
  }
}
