import { Component, OnInit, HostListener } from '@angular/core';
import { Timeline } from 'primeng/timeline';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { HeaderComponent } from '@app/header/header.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

@Component({
  selector: 'app-wordle-league',
  imports: [Timeline, Card, HeaderComponent, PageTitleComponent],
  templateUrl: './wordle-league.component.html',
})
export class WordleLeagueComponent {
  events = [
    {
      status: 'The Problem',
      date: 'January 2022',
      icon: 'pi pi-exclamation-triangle',
      color: '#f2e344ff',
      image: 'portfolio-images/wordle-bot/scoreboard-chat-2.png',
      description:
        'Family and friends groupchats were being filled with Wordle scores but a ' +
        'longer form of comparison was needed to discover the ultimate Wordler.'
    },
    {
      status: 'The Bandaid',
      date: 'February 2022',
      icon: 'pi pi-exclamation-circle',
      color: '#d30404ff',
      image: 'portfolio-images/wordle-bot/excel-scoreboard.jpg',
      description: 'An excel spreadsheet was being manually updated daily (by me) to keep track of ' +
        'scores. This took precious seconds of my day away so I knew we needed a better way...'
    },
    {
      status: 'The Solution',
      date: 'June 2023',
      icon: 'pi pi-lightbulb',
      color: '#2aa900ff',
      image: 'portfolio-images/wordle-bot/wordle-scoreboard.jpg',
      description: 'A Telegram bot was created to automate the collection and scoring of Wordle games. ' +
        'Users simply send their Wordle results to the bot and it updates the scoreboard automatically. ' +
        'The group chat prospered for long afterwards until the refactor itch struck and needed to be scratched...'
    },
    {
      status: 'The Redesign',
      date: 'November 2025',
      icon: 'pi pi-sparkles',
      color: '#7a49f8ff',
      image: 'portfolio-images/wordle-bot/new-scoreboard.jpg',
      description: 'A complete rewrite of the bot was undertaken. ' +
        'A bold new look, emoji reactions and an advanced color selecting algorithm were all added to enhance user experience.'
    },
    {
      status: 'The Future',
      date: 'Beyond 2025',
      icon: 'pi pi-angle-double-right',
      color: '#d730f5ff',
      image: 'portfolio-images/wordle-bot/themed-scoreboard.png',
      description: 'Themed scoreboards and a podium screen to close out seasons are currently in the works. ' +
        'There are also plans to introduce a rewards system and custom name styles for players to unlock.'
    },
  ];
}
