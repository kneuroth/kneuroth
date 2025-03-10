import { Component, computed, inject, input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Panel } from 'primeng/panel';
import { Tag } from 'primeng/tag';
import { Toast } from 'primeng/toast';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { Resume, SkillType } from './resume.model';
import { resume } from './resume.data';
import { PersonalProjectComponent } from './personal-project/personal-project.component';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { EducationComponent } from './education/education.component';
import { ɵINTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic';

@Component({
  selector: 'app-resume',
  imports: [
    Panel,
    Tag,
    Toast,
    Button,
    Divider,
    WorkExperienceComponent,
    PersonalProjectComponent,
    EducationComponent,
  ],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css',
})
export class ResumeComponent {
  constructor(private messageService: MessageService) {}

  DEFAULT_RESUME = resume;

  resume = input<Resume>(this.DEFAULT_RESUME);

  skillTypes = computed(
    () => new Set(this.resume().skills.map((skill) => skill.type)),
  );

  onClickPrint() {
    window.print();
  }

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
