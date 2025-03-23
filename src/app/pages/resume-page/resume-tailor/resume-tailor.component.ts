import { Component, inject, signal } from '@angular/core';
import { Button } from 'primeng/button';
import { ResumeTailorService } from './resume-tailor.service';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';
import { Panel } from 'primeng/panel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-resume-tailor',
  imports: [ReactiveFormsModule, FormsModule, Panel, RadioButton],
  templateUrl: './resume-tailor.component.html',
})
export class ResumeTailorComponent {
  tailorService = inject(ResumeTailorService);

  form = this.tailorService.resumeTailorForm;

  descriptions = this.tailorService.resumeOptions?.descriptions;

  options = this.tailorService.resumeOptions;
}
