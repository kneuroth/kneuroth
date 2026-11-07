/** Where a card's buttons go. `page` is a route on this site (a project with a
    page of its own, under /portfolio/<name>); the rest open off-site. */
export type ProjectLink =
  { kind: 'page'; to: string } | { kind: 'site' | 'github'; href: string };

export interface Project {
  title: string;
  description: string;
  /** Up to three are shown: a lead tile and the rest stacked beside it. */
  images?: string[];
  links?: ProjectLink[];
}

/** Display order down the page; sides alternate from the first. */
export const PROJECTS: Project[] = [
  {
    title: 'Wordle Bot',
    description: 'A chatbot that keeps the score of your Wordle games',
    images: [
      'portfolio-images/wordle-bot/scoreboard-chat.png',
      'portfolio-images/wordle-bot/wordle-scoreboard.jpg',
      'portfolio-images/wordle-bot/wordle-chat.jpg',
    ],
    links: [
      { kind: 'page', to: '/portfolio/wordle-league' },
      {
        kind: 'github',
        href: 'https://github.com/kneuroth/wordle-telegram-bot',
      },
    ],
  },
  {
    title: 'Arcade',
    description:
      'A retro-style arcade game collection featuring Gravity Rotator and Pong, built with Phaser 3 and React',
    images: [
      'portfolio-images/arcade/image1.png',
      'portfolio-images/arcade/image2.png',
      'portfolio-images/arcade/image3.png',
    ],
    links: [
      { kind: 'site', href: 'https://kneuroth.github.io/arcade/' },
      { kind: 'github', href: 'https://github.com/kneuroth/arcade' },
    ],
  },
  {
    title: "Kelly's Ride to Conquer Cancer",
    description:
      'A browser-based endless-runner game built to support a Ride to Conquer Cancer fundraiser — dodge obstacles, collect donations, murder cancer. Vanilla HTML/CSS/JS on a canvas, no build step.',
    images: [
      'portfolio-images/rtcc/logo.png',
      'portfolio-images/rtcc/biker.png',
      'portfolio-images/rtcc/cancer-cell.png',
    ],
    links: [
      { kind: 'site', href: 'https://kelly-conquers-cancer.netlify.app/' },
      { kind: 'github', href: 'https://github.com/kneuroth/kellys-rtcc' },
    ],
  },
  {
    title: '3D Art',
    description: 'A collection of 3D printed art pieces',
    images: [
      '3d-art/bricks-thumb.JPG',
      '3d-art/tetris-thumb.jpg',
      '3d-art/table-top-thumb.JPG',
    ],
    links: [{ kind: 'page', to: '/portfolio/3d-art' }],
  },
];
