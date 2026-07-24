import { Component, inject } from '@angular/core';
import { HeaderComponent } from '@app/header/header.component';
import { ResumeTailorComponent } from '@app/pages/resume-page/resume/resume-tailor/resume-tailor.component';
import { ResumeTailorService } from '@app/pages/resume-page/resume/resume-tailor/resume-tailor.service';
import { ResumeComponent } from '@app/pages/resume-page/resume/resume.component';
import { Tooltip } from 'primeng/tooltip';
import { GlowButtonComponent } from '@shared/ui/glow-button/glow-button.component';
import { GlassPanelComponent } from '@shared/ui/glass-panel/glass-panel.component';

@Component({
  selector: 'app-resume-page',
  imports: [
    ResumeComponent,
    Tooltip,
    ResumeTailorComponent,
    HeaderComponent,
    GlowButtonComponent,
    GlassPanelComponent,
  ],
  host: {
    '[style.background-image]': 'backgroundImage',
  },
  template: ` <app-header class="no-print -mt-20"></app-header>
    <div class="flex flex-col m-4 sm:m-10 gap-4">
      <app-resume-tailor class="no-print" [hidden]="hideTailor" />
      <app-glass-panel class="relative mx-auto w-full max-w-5xl p-6 sm:p-10 my-4">
        <!-- Controls — screen only, excluded from the downloaded PDF -->
        <div class="no-print absolute top-3 right-3 z-10 flex gap-1">
          <app-glow-button
            icon="pi pi-download"
            ariaLabel="Download as PDF"
            pTooltip="Download as PDF"
            variant="azure"
            [rounded]="true"
            (onClick)="onClickPrint()"
          />
          <app-glow-button
            [icon]="hideTailor ? 'pi pi-sliders-h' : 'pi pi-times'"
            [ariaLabel]="hideTailor ? 'Customize' : 'Stop customizing'"
            [pTooltip]="hideTailor ? 'Customize' : 'Stop customizing'"
            variant="azure"
            [rounded]="true"
            (onClick)="onClickCustomize()"
          />
        </div>
        <app-resume [resume]="resume()" />
      </app-glass-panel>
    </div>`,
  styleUrl: './resume-page.component.css',
})
export class ResumePageComponent {
  /** Buffalo backdrop, dimmed with a blue-black overlay so content reads.
      Relative URL resolves against the app base-href. */
  backgroundImage =
    'linear-gradient(rgb(10 22 40 / 0.5), rgb(10 22 40 / 0.5)), url(buffalo-building-1.jpg)';

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
