import { PortfolioEntry } from './model';

export const WORDLE_BOT: PortfolioEntry = {
  title: 'Wordle Bot',
  description: 'A chatbot that keeps the score of your Wordle games',
  image: [
    'portfolio-images/wordle-bot/scoreboard-chat.png',
    'portfolio-images/wordle-bot/wordle-scoreboard.jpg',
    'portfolio-images/wordle-bot/wordle-chat.jpg',
  ],
  media: {
    'pi-external-link': 'portfolio/wordle-league',
    'pi-github': 'https://github.com/kneuroth/wordle-telegram-bot',
  },
};

export const SENTENCE_GENERATOR: PortfolioEntry = {
  title: 'Case Study: Sentence Generator',
  description:
    'A tool to aggregate data to automate the generation of precise and accurate sentences',
  image: ['portfolio-images/sentence-gen.png'],
  media: {
    'pi-youtube': 'https://youtu.be/d4WSyCknZ2g',
  },
};

export const SURFACE_ART: PortfolioEntry = {
  title: 'Surface Art',
  description: 'A collection of 3D printed art pieces',
  image: ['surface-art/bricks-thumb.JPG', 'surface-art/tetris-thumb.jpg', 'surface-art/table-top-thumb.JPG',],
  media: {
    'pi-external-link': 'surface-art',
  },
}

export const RTCC: PortfolioEntry = {
  title: "Kelly's Ride to Conquer Cancer",
  description:
    'A browser-based endless-runner game built to support a Ride to Conquer Cancer fundraiser — dodge obstacles, collect donations, murder cancer. Vanilla HTML/CSS/JS on a canvas, no build step.',
  image: [
    'portfolio-images/rtcc/logo.png',
    'portfolio-images/rtcc/biker.png',
    'portfolio-images/rtcc/cancer-cell.png',
  ],
  media: {
    'pi-external-link': 'https://kelly-conquers-cancer.netlify.app/',
    'pi-github': 'https://github.com/kneuroth/kellys-rtcc',
  },
};

export const ARCADE: PortfolioEntry = {
  title: 'Arcade',
  description: 'A retro-style arcade game collection featuring Gravity Rotator and Pong, built with Phaser 3 and React',
  image: [
    'portfolio-images/arcade/image1.png',
    'portfolio-images/arcade/image2.png',
    'portfolio-images/arcade/image3.png',
  ],
  media: {
    'pi-external-link': 'https://kneuroth.github.io/arcade/',
    'pi-github': 'https://github.com/kneuroth/arcade',
  },
};
