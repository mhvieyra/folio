# Contributing to Folio

Thanks for considering a contribution. Folio is a small project, so the
process is deliberately light.

## Getting set up

```bash
pnpm install
pnpm dev
```

Requires Node.js 18+ and pnpm. There's no backend and no environment
variables to configure — the app is a static Next.js client app.

Before opening a PR, please run:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

All three should pass cleanly.

## Project layout

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how the codebase is
organized (domain logic in `lib/report/`, UI in `components/report/`, pages
in `app/`) and [`docs/report-schema.md`](docs/report-schema.md) for the
report document format.

## Ways to contribute

- **Bug reports** — open an issue with steps to reproduce and, if possible,
  the exported JSON of the report that triggered it.
- **Feature ideas** — check the Roadmap in [README.md](README.md) and open
  or comment on an issue before writing a lot of code, so we can agree on
  the approach first.
- **Pull requests** — small, focused PRs are much easier to review than
  large ones. If a change touches the report schema, please update
  `docs/report-schema.md` and `lib/report/sample.ts` in the same PR.

## Code style

- TypeScript, strict mode. No `any` unless there's genuinely no better
  option.
- Components stay presentational where possible — calculations belong in
  `lib/report/calculations.ts`, not scattered across JSX.
- Prefer small, composable functions over new abstractions "just in case."
- No comments explaining *what* code does — name things clearly instead.
  Comments are for *why*, when it isn't obvious from the code.
- Formatting follows the existing files (2-space indent, single quotes,
  no semicolons in `lib/`). Run `pnpm lint` before committing.

## Commit messages

Plain, descriptive, present tense (`Add expense allocation toggle` rather
than `Added` or `Adding`). No fixed convention beyond that.

## Reporting security issues

This is a client-only, local-storage tool with no server component and no
user accounts, so the security surface is small. If you find something
that concerns you regardless, please open an issue describing it — there's
no separate disclosure process for a project this size.

## Code of conduct

By participating in this project you agree to abide by the
[Code of Conduct](CODE_OF_CONDUCT.md).
