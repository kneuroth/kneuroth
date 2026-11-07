import {
  ChevronsRight,
  CircleAlert,
  Lightbulb,
  Send,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { GlowButton } from '@/components/ui/glow-button';
import { cx } from '@/components/ui/kn-utils';
import { Reveal } from '@/components/ui/reveal';
import { Header } from '@/header';
import { GithubIcon } from '@/icons';
import { asset } from '@/lib/router';
import { PageTitle } from '@/page-title';

interface Chapter {
  status: string;
  date: string;
  icon: LucideIcon;
  /** Screenshots, tallest first. Phone shots are framed as phones. */
  images: string[];
  description: string;
}

/** The project's history. This one is genuinely a sequence, so it earns a
    timeline — every other list on the site stays unnumbered. */
const CHAPTERS: Chapter[] = [
  {
    status: 'The Problem',
    date: 'January 2022',
    icon: TriangleAlert,
    images: ['portfolio-images/wordle-bot/wordle-chat.jpg'],
    description:
      "It's post-COVID times and a family begins to Wordle. They share their scores in the family chat, but disputes break out, arguing for the credit of the top Wordler. No platform exists to compare scores across days or weeks of playing.",
  },
  {
    status: 'The Bandaid',
    date: 'February 2022',
    icon: CircleAlert,
    images: ['portfolio-images/wordle-bot/excel-scoreboard-edited.jpg'],
    description:
      'One could, and one did, manually update an Excel spreadsheet to keep track of scores. Updating and sending daily screenshots took a tremendous amount of time and resources from my day so I knew we needed a better way...',
  },
  {
    status: 'The Solution',
    date: 'June 2023',
    icon: Lightbulb,
    images: ['portfolio-images/wordle-bot/wordle-scoreboard-edited.jpg'],
    description:
      'And so the Telegram Wordle Bot was born! Users simply send their Wordle results to the bot and it updates the scoreboard automatically.',
  },
  {
    status: 'The Redesign',
    date: 'November 2025',
    icon: Sparkles,
    images: ['portfolio-images/wordle-bot/new-scoreboard-inchat.jpg'],
    description:
      'A complete rewrite of the bot was undertaken. A rebranding to Wordle League. A sleeker design, emoji reactions, and an advanced per-player color selecting algorithm were all added to enhance user experience.',
  },
  {
    status: 'The Future',
    date: 'Beyond 2025',
    icon: ChevronsRight,
    images: [
      'portfolio-images/wordle-bot/themed-scoreboard.png',
      'portfolio-images/wordle-bot/future-podium.png',
    ],
    description:
      'We are now looking to the future to improve Wordle League. Themed scoreboards are rolling out to keep things interesting and align with the seasons. A podium screen will now be sent to close out a season and enhance the visibility of the Wordle athelete who won the Season Championchip. We have plans to introduce a rewards system that allows players to customize their names on the scoreboard. We will continue to maintain the project code for as long as Wordle is being played and local champions are being praised.',
  },
];

/**
 * Wordle League — the bot's story, told as a timeline of glass panels.
 *
 * It stands on the veiled desk like every other page now (no navy sub-brand
 * ground of its own). Each chapter is a floating panel that arrives once from
 * alternating sides, hung off one hairline running down the page, with the
 * chapter's glyph as the marker where it meets the line.
 */
export function WordleLeague() {
  return (
    <>
      <Header />
      <PageTitle
        title="Wordle League"
        subtitle={
          <>
            A chat bot that turns Telegram group chats into competitive Wordle
            leagues. Add{' '}
            <span className="keep-case text-white">@WordleLeagueProdBot</span>{' '}
            to your group chat on Telegram to try it out now!
          </>
        }
      />
      <div className="mx-6 flex flex-wrap gap-3 sm:mx-10">
        <GlowButton
          sweep
          href="https://t.me/WordleLeagueProdBot"
          target="_blank"
          rel="noopener noreferrer"
          icon={<Send />}
        >
          Try it on Telegram
        </GlowButton>
        <GlowButton
          sweep
          href="https://github.com/kneuroth/wordle-telegram-bot"
          target="_blank"
          rel="noopener noreferrer"
          icon={<GithubIcon />}
        >
          Source
        </GlowButton>
      </div>

      <div className="overflow-x-clip pt-12 pb-24">
        <ol className="relative mx-auto flex max-w-5xl list-none flex-col gap-14 px-6 sm:px-10">
          {/* The line every chapter hangs from: through the markers' centres
              (the list's padding + half a 2.25rem marker). */}
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[2.625rem] w-px bg-gradient-to-b from-white/0 via-white/35 to-white/0 sm:left-[3.625rem]"
          />
          {CHAPTERS.map((chapter, i) => (
            <li key={chapter.status}>
              <Reveal from={i % 2 === 0 ? 'left' : 'right'}>
                <ChapterCard chapter={chapter} />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function ChapterCard({ chapter }: { chapter: Chapter }) {
  const Icon = chapter.icon;
  const pair = chapter.images.length > 1;
  return (
    <div className="flex gap-4 sm:gap-6">
      {/* The marker: the chapter's glyph, in the icon identity every icon on
          the site wears. */}
      <span
        aria-hidden="true"
        className="relative z-[1] mt-5 flex size-9 flex-none items-center justify-center rounded-full border border-white/30 bg-[rgb(10_22_40/0.8)] text-[var(--sweep-base)] [filter:drop-shadow(0_0_8px_rgb(130_175_225/0.45))]"
      >
        <Icon className="size-4.5" />
      </span>

      <GlassPanel className="min-w-0 flex-1 p-5 sm:p-7">
        <div
          className={cx(
            'flex flex-col gap-6',
            !pair && 'md:flex-row md:items-start',
          )}
        >
          <div className="md:flex-1">
            <p className="text-xs tracking-wide text-frenchgrey/80">
              {chapter.date}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              {chapter.status}
            </h2>
            <p className="mt-3 text-sm/6 text-white/75">
              {chapter.description}
            </p>
          </div>
          <div
            className={cx(
              'flex gap-4',
              pair ? 'justify-center' : 'md:w-56 md:flex-none',
            )}
          >
            {chapter.images.map((src) => (
              <figure
                key={src}
                className={cx(
                  'thumb mx-auto w-full max-w-56',
                  pair && 'max-w-64 flex-1',
                )}
              >
                <img
                  src={asset(src)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </figure>
            ))}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
