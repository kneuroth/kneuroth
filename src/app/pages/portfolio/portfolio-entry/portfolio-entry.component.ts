import { Component, input } from '@angular/core';
import { PortfolioEntry } from '../model';
import { KeyValuePipe } from '@angular/common';
import { GlowButtonComponent } from '@shared/ui/glow-button/glow-button.component';

@Component({
  selector: 'app-portfolio-entry',
  imports: [GlowButtonComponent, KeyValuePipe],
  templateUrl: './portfolio-entry.component.html',
  template: ``,
})
export class PortfolioEntryComponent {
  portfolioEntry = input.required<PortfolioEntry>();

  /** Accessible labels for the icon-only media buttons, keyed by icon class. */
  private readonly MEDIA_LABELS: Record<string, string> = {
    'pi-github': 'View source on GitHub',
    'pi-youtube': 'Watch on YouTube',
    'pi-external-link': 'Open project',
  };

  mediaLabel(key: string): string {
    return this.MEDIA_LABELS[key] ?? 'Open link';
  }

  onMediaClick(url: string) {
    window.open(url, '_blank');
  }
}
