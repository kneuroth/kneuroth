import { Component, inject } from '@angular/core';
import { ResumeComponent } from '@app/resume/resume.component';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { ResumeTailorService } from './resume-tailor.service';
import { ResumeTailorComponent } from './resume-tailor/resume-tailor.component';

@Component({
  selector: 'app-resume-page',
  imports: [ResumeComponent, Button, Divider, ResumeTailorComponent],
  template: ` <div class="flex flex-col m-10 gap-4">
    <div class="flex no-print ml-auto gap-2">
      <!-- Controls -->
      <p-button
        label="Download as PDF"
        icon="pi pi-download"
        severity="success"
        (click)="onClickPrint()"
      />
      <p-button
        [label]="hideTailor ? 'Customize' : 'Stop Customizing'"
        class="no-print ml-auto"
        severity="info"
        (click)="onClickCustomize()"
      />
    </div>

    <app-resume-tailor class="no-print" [hidden]="hideTailor" />
    <p-divider class="no-print" />
    <app-resume [resume]="resume()" />
  </div>`,
})
export class ResumePageComponent {
  tailorService = inject(ResumeTailorService);

  resume = this.tailorService.resume;

  hideTailor = true;

  onClickPrint() {
    window.print();
  }

  onClickCustomize() {
    this.hideTailor = !this.hideTailor;
  }
}
