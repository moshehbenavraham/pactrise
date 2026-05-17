# Dealflow

Dealflow is a sales CRM workspace for managing pipelines, contacts, companies,
activities, tasks, forecasting, reports, and data import/export.

## Tech Stack

- Vite
- TypeScript
- React
- React Router
- Supabase
- shadcn/ui
- Tailwind CSS
- Vitest

## Local Development

Install Node.js and npm, then run:

```sh
npm i
npm run dev
```

## Environment

Create a `.env` file with the Supabase project values used by the app:

```sh
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_PROJECT_ID="your-project-id"
```

Google sign-in is handled through Supabase Auth. Configure the Google provider
and allowed redirect URLs in Supabase before using OAuth in production.

## Scripts

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm test` runs the Vitest suite.

## Deployment

Build the app with `npm run build` and deploy the `dist` directory to any
static hosting provider. Supabase migrations are stored in `supabase/migrations`.
