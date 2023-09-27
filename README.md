# Upwork Job Filter

The Upwork Job Filter is a tool designed to filter out the jobs and keep you updated on the latest jobs on Upwork.

## Setup

Install the dependencies:

```bash
pnpm install
```

Generate the vapid keys:

```bash
pnpm web-push generate-vapid-keys
```

Make a copy of the environment variables file.

```bash
cp .env.example .env
```

Prepare Nuxt.

```bash
pnpm nuxt prepare
```

Set git hooks.

```bash
git config core.hooksPath .githooks
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
pnpm run dev
```

## Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```

Start the pm2 for the background process:

```bash
pnpm run start
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Resources

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## License

Upwork Job Filter is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
