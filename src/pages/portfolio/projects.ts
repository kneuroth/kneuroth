/** Where a card's buttons go. `page` is a route on this site (a project with a
    page of its own, under /portfolio/<name>); the rest open off-site. */
export type ProjectLink =
  { kind: 'page'; to: string } | { kind: 'site' | 'github'; href: string };

export interface Project {
  title: string;
  description: string;
  /** Up to three are shown: a lead tile and the rest stacked beside it. */
  images?: string[];
  /** The heading links to the `page` if there is one, else the `site`. */
  links?: ProjectLink[];
  /** One of the (three) big edge-joined cards that fly in. Everything else is
      a slim row in the list below them. */
  featured?: boolean;
}

/** Display order: featured cards down the page in this order (sides alternate
    from the first), then the rest in the list below, in this order. */
export const PROJECTS: Project[] = [
  {
    title: 'Wordle Bot',
    featured: true,
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
    title: '3D Art',
    featured: true,
    description: 'A collection of 3D printed art pieces',
    images: [
      '3d-art/bricks-thumb.JPG',
      '3d-art/tetris-thumb.jpg',
      '3d-art/table-top-thumb.JPG',
    ],
    links: [{ kind: 'page', to: '/portfolio/3d-art' }],
  },
  {
    title: 'Faculty Finder',
    featured: true,
    description:
      'A keyword search for OCAD U faculty for students finding MRP advisors. Based on web scrapped advisor info. Results link to the OCAD faculty page or most relevant page found',
    images: ['portfolio-images/advisor-finder/image-1.png'],
    links: [
      { kind: 'site', href: 'https://kneuroth.github.io/ocad-advisor-finder/' },
      {
        kind: 'github',
        href: 'https://github.com/kneuroth/ocad-advisor-finder',
      },
    ],
  },
  {
    title: 'Arcade',
    description:
      'arcade game style sandbox collection, try paddle master!',
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
      'endless-runner game built to support my PMRCC fundraising in 2026',
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
];
