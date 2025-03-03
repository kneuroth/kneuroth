import { Component, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Panel } from 'primeng/panel';
import { Tag } from 'primeng/tag';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-resume',
  imports: [Panel, Tag, Toast],
  templateUrl: './resume.component.html',
})
export class ResumeComponent {
  constructor(private messageService: MessageService) {}

  onClickGithub() {
    window.location.href = 'https://github.com/kneuroth';
  }

  onClickEmail() {
    window.location.href = 'mailto:kelly.neuroth@outlook.com?&body=Hi Kelly,';
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
