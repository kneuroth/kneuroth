import { Component, computed, input } from '@angular/core';
import { PersonalProject } from '../resume.model';
import { GlowButtonComponent } from '@shared/ui/glow-button/glow-button.component';
import { GlowSweepDirective } from '@shared/ui/glow-sweep.directive';

@Component({
  selector: 'app-personal-project',
  imports: [GlowButtonComponent, GlowSweepDirective],
  templateUrl: './personal-project.component.html',
})
export class PersonalProjectComponent {
  personalProject = input.required<PersonalProject>();

  name = computed(() => this.personalProject().name);

  link = computed(() => this.personalProject().link);
  bullets = computed(() => this.personalProject().bullets);

  onClickLink(link: string) {
    window.location.href = link;
  }
}
