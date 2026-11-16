# Crew Layover Guide

Cabin-crew layover notes. The site lists cities, then one city's tips by category. Crew Help answers only from published tips.

## Live

- Site: https://n-blessing.github.io/crew-layover-guide/
- Crew Help: https://n-blessing.github.io/crew-layover-guide/help/
- Studio: https://crew-layover-guide.sanity.studio/
- Sanity project `p4yybrla`, dataset `production` (public). Reading it does not need a token, and this repo does not contain one.

Published content is written by crew: **5 cities** (Accra, Brussels, Doha, Dubai, Johannesburg) and **25 tips**.

`seed/seed.ndjson` is not that content. It is offline fallback and starter data only: Brussels, Dubai, Lagos, and Nairobi, with 10 tips titled `EXAMPLE:` and `isExample: true`. The pages use it when a published query returns no cities or no tips, and they show a banner when they do. Do not import it over `production` if you want to keep the crew notes.

## Stack

Astro 7.4.12, React 19.3.1, Sanity Studio 6.23.0 (`@sanity/astro` 3.6.2, `@sanity/client` 8.16.0). Node.js 22.23.4 or newer. `package-lock.json` pins the install. GROQ results are typed by Sanity TypeGen in `src/sanity/sanity.types.ts`.

## Content model

`city`: name, slug, country, airportCode, currency, timezone, hero image with alt, summary.

`tip`: title, category, Portable Text body, timeNeeded, costLevel, city reference, isExample.

Categories: Food, Transport, Rest, Sightseeing, Safety (`food`, `transport`, `rest`, `sightseeing`, `safety`).

Cost levels: Free, Low, Moderate, High (`free`, `low`, `moderate`, `high`).

Queries in `src/lib/queries.ts` use the `published` perspective and skip `drafts.**` and `versions.**`. Drafts and Content Release versions stay off the site until they are published and the site is rebuilt.

## Run locally

```bash
npm install
npm run dev
```

Site and embedded Studio: http://localhost:4477 and http://localhost:4477/admin (hash routing). Standalone Studio: `npm run dev:studio` on http://localhost:3333.

`npm run build` writes the static site to `dist/` and does not need a `.env` file. Defaults live in `sanity.shared.mjs` (project `p4yybrla`, dataset `production`). Copy `.env.example` to `.env` only to point at a different project. `PUBLIC_` values are visible in the browser. Never put a token in a `PUBLIC_` or `SANITY_STUDIO_` variable. Leave `SANITY_API_READ_TOKEN` unset for this public dataset.

Do not run `npm create sanity@latest` in this folder. It scaffolds a new Studio and can overwrite files.

## Deployment

The live site is a static Astro build on GitHub Pages, served from the orphan `gh-pages` branch. That branch's root is the contents of `dist/` (there is no `dist/` directory on the branch), including `.nojekyll`, so Pages serves `_astro/` and other files whose names start with an underscore. `astro.config.mjs` sets `site` to `https://n-blessing.github.io` and `base` to `/crew-layover-guide/`.

`.github/workflows/deploy-pages.yml` is written to build on a push to `main` and deploy with GitHub Actions. That workflow could not run, because the GitHub account had Actions locked over a billing issue. The built `dist` was pushed to `gh-pages` manually. The live site is that snapshot.

Content is fetched at build time. After a publish in Studio, run `npm run build` and push the new `dist/` contents to `gh-pages` again. A push to `main` does not refresh GitHub Pages while Actions cannot run.

Netlify or Vercel can host the same static build (`npm run build`, output directory `dist`, Node 22) as an optional alternative. They are not how this site is deployed.

Hosted Studio is https://crew-layover-guide.sanity.studio (`studioHost` in `sanity.cli.ts`). `npx sanity deploy` updates that Studio. `/admin` on the static site is the embedded Studio.

CORS origins for project `p4yybrla` (turn on credentials only for domains you control):

- `http://localhost:4477`
- `http://localhost:3333`
- `https://crew-layover-guide.sanity.studio`
- `https://n-blessing.github.io`

## Seed import

`scripts/generate-example-seed.mjs` is the readable source of the fallback file. `npm run seed:write` regenerates `seed/seed.ndjson`.

Import it only when you mean to load that starter data:

```bash
npx sanity datasets import seed/seed.ndjson production --replace
```

`--replace` overwrites documents with the same `_id`. Use `--missing` to leave documents you have already edited.

Tips in the seed use ordinary strong references, because those four cities are in the same file. When an import references a city that is not published yet, Sanity stores the reference as weak (`_weak: true`) and sets `_strengthenOnPublish`. Publishing that city strengthens the reference.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Astro site and embedded Studio on port 4477 |
| `npm run dev:studio` | Standalone Studio on port 3333 |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve `dist/` on port 4477 |
| `npm run typegen` | Refresh `schema.json` and `src/sanity/sanity.types.ts` |
| `npm run check` | Seed, Crew Help, schema, types, and lint |

## Layout

```text
astro.config.mjs     site, base /crew-layover-guide/, published perspective, Studio at /admin
sanity.config.ts     Studio schema, desk, Vision
sanity.cli.ts        project p4yybrla, dataset production, hosted Studio hostname
src/lib/queries.ts   GROQ; excludes drafts and versions
src/lib/content.ts   published fetch; seed fallback when that fetch is empty
seed/seed.ndjson     offline fallback only (not the live cities)
```

Pages: `/` city list, `/cities/[slug]` one city, `/help/` Crew Help, `/admin` embedded Studio.
