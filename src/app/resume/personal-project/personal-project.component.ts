import { Component, computed, input } from '@angular/core';
import { PersonalProject } from '../resume.model';
import { Panel } from 'primeng/panel';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-personal-project',
  imports: [Button],
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
