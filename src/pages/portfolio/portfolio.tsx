import { Reveal } from '@/components/ui/reveal';
import { Header } from '@/header';
import { ProjectCard } from './project-card';
import { PROJECTS } from './projects';

/**
 * The project showcase — where the cube on the desk leads. Full-bleed slabs
 * joined alternately to the left and right edge of the screen, each flying in
 * from the edge it's attached to. No centred container: that's what makes them
 * read as part of the edge. Keep the alternation unbroken when adding one.
 */
export function Portfolio() {
  return (
    <>
      <Header animateOnLoad />
      {/* overflow-x-clip contains the reveal entrances, which start off-screen. */}
      <div className="relative isolate overflow-x-clip pt-16 pb-24">
        <section className="flex flex-col gap-20 sm:gap-28">
          {PROJECTS.map((project, i) => {
            const side = i % 2 === 0 ? 'left' : 'right';
            return (
              <Reveal key={project.title} from={side}>
                <div
                  className={
                    side === 'left'
                      ? 'mr-auto w-[88%] max-w-5xl sm:w-[78%] lg:w-[62%]'
                      : 'ml-auto w-[88%] max-w-5xl sm:w-[78%] lg:w-[62%]'
                  }
                >
                  <ProjectCard project={project} side={side} />
                </div>
              </Reveal>
            );
          })}
        </section>
      </div>
    </>
  );
}
