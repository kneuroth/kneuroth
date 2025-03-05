import { Component, computed, inject, input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Panel } from 'primeng/panel';
import { Tag } from 'primeng/tag';
import { Toast } from 'primeng/toast';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { Resume, SkillType } from './resume.model';
import { resume } from './resume.data';
import { PersonalProjectComponent } from './personal-project/personal-project.component';

@Component({
  selector: 'app-resume',
  imports: [
    Panel,
    Tag,
    Toast,
    WorkExperienceComponent,
    PersonalProjectComponent,
  ],
  templateUrl: './resume.component.html',
})
export class ResumeComponent {
  constructor(private messageService: MessageService) {}

  DEFAULT_RESUME = resume;

  resume = input<Resume>(this.DEFAULT_RESUME);

  skillTypes = computed(
    () => new Set(this.resume().skills.map((skill) => skill.type)),
  );

  getFilteredSkills(skillType: SkillType) {
    return this.resume().skills.filter((skill) => skill.type === skillType);
  }

  onClickLink(link: string) {
    window.location.href = link;
  }

  onClickEmail(email: string) {
    window.location.href = `mailto:${email}?&body=Hi ${this.resume().name},`;
  }

  // Little counter intuitive argument naming and typing
  onClickPhone(number: string) {
    navigator.clipboard.writeText(number);
    this.messageService.add({
      detail: 'Copied to clipboard',
      life: 1000,
      icon: 'pi pi-copy',
    });
  }
}
