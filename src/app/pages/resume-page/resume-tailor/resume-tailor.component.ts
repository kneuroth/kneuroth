import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { ResumeTailorService } from './resume-tailor.service';

@Component({
  selector: 'app-resume-tailor',
  imports: [Button],
  templateUrl: './resume-tailor.component.html',
  styleUrl: './resume-tailor.component.css',
})
export class ResumeTailorComponent {
  tailorService = inject(ResumeTailorService);

  onChangeName() {
    this.tailorService.changeName();
  }
}
