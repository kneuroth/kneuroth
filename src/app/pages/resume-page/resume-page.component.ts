import { Component, inject } from '@angular/core';
import { HeaderComponent } from "@app/header/header.component";
import { ResumeTailorComponent } from '@app/pages/resume-page/resume/resume-tailor/resume-tailor.component';
import { ResumeTailorService } from '@app/pages/resume-page/resume/resume-tailor/resume-tailor.service';
import { ResumeComponent } from '@app/pages/resume-page/resume/resume.component';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-resume-page',
  imports: [ResumeComponent, Button, Divider, ResumeTailorComponent, HeaderComponent],
  template: ` 
  <app-header class="no-print -mt-20"></app-header>
  <div class="flex flex-col m-10 gap-4">
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
