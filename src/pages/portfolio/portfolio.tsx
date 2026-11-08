import { Reveal } from '@/components/ui/reveal';
import { Header } from '@/header';
import { ProjectCard, ProjectRow } from './project-card';
import { PROJECTS } from './projects';

const FEATURED = PROJECTS.filter((p) => p.featured);
const MORE = PROJECTS.filter((p) => !p.featured);

/**
 * The project showcase — where the cube on the desk leads.
 *
 * The featured three lead: full-bleed slabs joined alternately to the left and
 * right edge of the screen, each flying in from the edge it's attached to. No
 * centred container — that's what makes them read as part of the edge. Keep
 * the alternation unbroken when adding one.
 *
 * Everything else follows as a quieter list of slim panels, centred, no
 * entrance.
 */
export function Portfolio() {
  return (
    <>
      <Header animateOnLoad />
      {/* overflow-x-clip contains the reveal entrances, which start off-screen. */}
      <div className="relative isolate overflow-x-clip pt-16 pb-24">
        <section className="flex flex-col gap-20 sm:gap-28">
          {FEATURED.map((project, i) => {
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

        {MORE.length > 0 && (
          <section
            aria-labelledby="more-projects"
            className="mx-auto mt-24 flex max-w-3xl flex-col gap-5 px-6 sm:mt-32"
          >
            <h2 id="more-projects" className="text-sm text-frenchgrey">
              More projects
            </h2>
            {MORE.map((project) => (
              <ProjectRow key={project.title} project={project} />
            ))}
          </section>
        )}
      </div>
    </>
  );
}
