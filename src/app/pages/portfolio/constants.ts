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
