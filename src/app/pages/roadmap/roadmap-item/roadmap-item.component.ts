import { Component, computed, input } from '@angular/core';
import {
  RoadmapItem,
  RoadmapItemStatus,
  RoadmapItemType,
} from '../roadmap-item/roadmap-item.model';
import { Panel } from 'primeng/panel';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-roadmap-item',
  imports: [Panel, Tag, Button, Tooltip],
  templateUrl: './roadmap-item.component.html',
})
export class RoadmapItemComponent {
  roadmapItem = input.required<RoadmapItem>();

  name = computed(() => this.roadmapItem().name);
  description = computed(() => this.roadmapItem().description);
  type = computed(() => this.roadmapItem().type);
  status = computed(() => this.roadmapItem().status);
  link = computed(() => this.roadmapItem().link);

  statusSeverity = computed(() => {
    switch (this.status()) {
      case RoadmapItemStatus.Done:
        return 'success';
      case RoadmapItemStatus.InProgress:
        return 'info';
      case RoadmapItemStatus.Backlog:
        return 'secondary';
      default:
        return undefined;
    }
  });

  typeIcon = computed(() => {
    switch (this.type()) {
      case RoadmapItemType.Bug:
        return 'pi pi-asterisk';
      case RoadmapItemType.Enhancement:
        return 'pi pi-star';
      case RoadmapItemType.Feature:
        return 'pi pi-flag-fill';
      default:
        return undefined;
    }
  });

  typeDescription = computed(() => {
    switch (this.type()) {
      case RoadmapItemType.Bug:
        return 'Bug';
      case RoadmapItemType.Enhancement:
        return 'Enhancement';
      case RoadmapItemType.Feature:
        return 'Feature';
      default:
        return undefined;
    }
  });

  onClickLink(link: string) {
    window.location.href = link;
  }
}
