# Didanum Didaspace

## Overview

Didanum Didaspace is a web application built with Nuxt 3.

It lets you:
- browse educational resources from a Directus API;
- navigate content in French and German (i18n);
- display rich content with Tailwind CSS + DaisyUI.

Main configuration is handled in `nuxt.config.ts`.

## Development

### Prerequisites

- Node.js 22 (recommended)
- npm

### Setup

```bash
npm install
npm run dev
```

App: `http://localhost:3000`

### Update

```bash
git pull
npm install
```

## Production deployment with Podman

The image builds the app at build time and serves it via the Nuxt server on port 3000.

### Build the image

```bash
podman build -t didanum-didaspace .
```

### Run as a systemd service (Quadlet)

A Quadlet unit file is provided in [deploy/didanum-didaspace.container](deploy/didanum-didaspace.container). It exposes the app on `127.0.0.1:8099`.

```bash
cp deploy/didanum-didaspace.container ~/.config/containers/systemd/
systemctl --user daemon-reload
systemctl --user start didanum-didaspace
```

### Update

```bash
git pull
podman build -t didanum-didaspace .
systemctl --user restart didanum-didaspace
```
