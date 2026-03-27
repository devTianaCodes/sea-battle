# Deployment Guide

Sea Battle is a static frontend app, so it can be deployed directly to Vercel or Netlify after a production build.

## Build Settings

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18+

## Environment Variables

Copy `.env.example` to `.env` if you need a custom base path.

```bash
cp .env.example .env
```

Available variable:

- `VITE_BASE_PATH`: Base URL for the deployed app. Use `/` for root deployments or `/repo-name/` for subpath hosting.

## Vercel

1. Import the repository into Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. If the app is deployed under a subpath, set `VITE_BASE_PATH` accordingly.

## Netlify

1. Create a new site from the repository.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Add `VITE_BASE_PATH` only if the app is served from a subdirectory.

## GitHub Pages Or Subpath Hosting

Set:

```bash
VITE_BASE_PATH=/sea-battle/
```

Then run:

```bash
npm run build
```

Deploy the contents of `dist/` to the target host.

## Performance Notes

- Production sourcemaps are enabled to simplify debugging deployed builds.
- Background effects can be disabled in-app for lower-powered devices.
- The app is fully static, so CDN hosting is sufficient.
