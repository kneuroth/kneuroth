# Kneuroth

[GO](https://kneuroth.github.io/kneuroth/)

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.2.0.

## What's the tech?

- NVM
- Node 22.\*
- Angular 20
- PrimeNG 20
- Tailwindcss 4

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

## Deploying (to github pages)

```
ng deploy --base-href "/kneuroth/"
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Updating the resume page (Claude Code agent)

The resume page is driven by option data in
`src/app/pages/resume-page/resume/resume-tailor/data/resume-options.data.ts`. A
project-specific Claude Code agent, **`resume-updater`**, keeps that data current.

It can read one directory back — the resume source of truth at
`../Resumes/master/resume.typ` and sibling project folders — but only ever writes
to files inside this repo.

### Two things it does

- **Add a project** to the resume page. It scans the target project's README,
  `package.json`, and git history, drafts a `PersonalProject` entry, and shows it to
  you for approval before writing.
- **Sync the resume** with the Resumes project — pulls updated summaries, experience
  bullets, skills, and projects from `../Resumes/master/resume.typ` and proposes the
  diffs.

### How to use it

Start a Claude Code session in this repo and just ask — it delegates to the agent
automatically:

```
Add my the-weekly-grain project to the resume page
Update the resume page to match my resume project
```

Inspect or tweak the agent with `/agents`. Its definition lives in
`.claude/agents/resume-updater.md`.

### One-time setup on a new machine

The agent needs read access to the parent projects directory. That permission is
kept in `.claude/settings.local.json` (gitignored, so it isn't committed):

```json
{
  "permissions": {
    "additionalDirectories": ["/home/kneuroth/projects"]
  }
}
```

Recreate that file (adjusting the path to wherever your projects live) after cloning,
then restart Claude Code so the agent loads.
