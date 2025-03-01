import { Component, computed, input } from '@angular/core';
import { RoadmapItem, RoadmapItemType } from '../roadmap.constants';
import { Panel } from 'primeng/panel';
import { Tag } from 'primeng/tag';
import { Button } from 'primeng/button';

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

  onClickLink(link: string) {
    console.log(link);
    window.location.href = link;
  }
}
