import { Component, OnInit, HostListener } from '@angular/core';
import { HeaderComponent } from '@app/header/header.component';
import { PageTitleComponent } from '@shared/components/page-title/page-title.component';

@Component({
  selector: 'app-wordle-league',
  imports: [HeaderComponent, PageTitleComponent],
  templateUrl: './wordle-league.component.html',
})
export class WordleLeagueComponent {
  events = [
    {
      status: 'The Problem',
      date: 'January 2022',
      icon: 'pi pi-exclamation-triangle',
      color: '#f2e344ff',
      image: 'portfolio-images/wordle-bot/wordle-chat.jpg',
      description:
        'It was February of 2022 and family and friends\' groupchats were being filled with Wordle scores but ' +
        'it was hard to tell who the ultimate Wordler was.'
    },
    {
      status: 'The Bandaid',
      date: 'February 2022',
      icon: 'pi pi-exclamation-circle',
      color: '#d30404ff',
      image: 'portfolio-images/wordle-bot/excel-scoreboard-edited.jpg',
      description: 'I started to manually update an Excel spreadsheet to keep track of ' +
        'scores. This took precious seconds of my day. I knew we needed a better way...'
    },
    {
      status: 'The Solution',
      date: 'June 2023',
      icon: 'pi pi-lightbulb',
      color: '#2aa900ff',
      image: 'portfolio-images/wordle-bot/wordle-scoreboard-edited.jpg',
      description: 'And so the Telegram Wordle Bot was born!  ' +
        'Users simply send their Wordle results to the bot and it updates the scoreboard automatically. '
    },
    {
      status: 'The Redesign',
      date: 'November 2025',
      icon: 'pi pi-sparkles',
      color: '#7a49f8ff',
      image: 'portfolio-images/wordle-bot/new-scoreboard-inchat.jpg',
      description: 'A complete rewrite of the bot was undertaken. ' +
        'A sleek AI assisted look, emoji reactions, and an advanced color selecting algorithm were all added to enhance user experience.'
    },
    {
      status: 'The Future',
      date: 'Beyond 2025',
      icon: 'pi pi-angle-double-right',
      color: '#d730f5ff',
      image: 'portfolio-images/wordle-bot/themed-scoreboard.png',
      image2: 'portfolio-images/wordle-bot/future-podium.png',
      description: 'There is lots of room for improvement! Themed scoreboards are rolling out and a podium screen will now be sent to close out a season. ' +
        'There are also plans to introduce a rewards system and custom name styles for players to unlock! ' +
        'Stay tuned and keep \'em in the green!'
    },
  ];
}
