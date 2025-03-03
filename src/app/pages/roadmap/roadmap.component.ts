import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoadmapItemComponent } from './roadmap-item/roadmap-item.component';
import {
  RoadmapItem,
  RoadmapItemStatus,
  RoadmapItemType,
} from '../roadmap/roadmap-item/roadmap-item.model';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { roadmapItems } from './roadmap-item/roadmap-item.data';

@Component({
  selector: 'app-roadmap',
  imports: [FormsModule, RoadmapItemComponent, PageTitleComponent],
  templateUrl: './roadmap.component.html',
})
export class RoadmapComponent {
  roadmapItems = roadmapItems;
}
