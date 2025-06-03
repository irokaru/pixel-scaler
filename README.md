<div align="center">  
  <a href="https://irokaru.github.io/pixel-scaler/">
    <img src="./public/logo.png" width="33%" alt="Pixel Scaler Logo"/>
  </a>
  <p><b>A pixel art upscaling tool</b></p>

  <!-- Badges -->
  <p>
    <a href="https://github.com/irokaru/pixel-scaler/releases/latest"><img src="https://img.shields.io/github/v/release/irokaru/pixel-scaler.svg?style=for-the-badge" alt="Latest Release"/></a>
    <img src="https://img.shields.io/github/downloads/irokaru/pixel-scaler/total?style=for-the-badge" alt="Downloads"/>
    <a href="https://app.codecov.io/gh/irokaru/pixel-scaler/tree/master"><img src="https://img.shields.io/codecov/c/github/irokaru/pixel-scaler?style=for-the-badge" alt="Coverage"/></a>
    <a href="https://x.com/IroKaru"><img src="https://img.shields.io/twitter/follow/irokaru?style=for-the-badge" alt="Follow on X"/></a>
  </p>
</div>

## Development Environment

* node (>= 22.x)
* rust (>=1.85.0)
  * (required for Tauri development)

## Setup for Development (WSL)

Install dependencies:

```sh
npm ci
```

(Optional) If you want to use Tauri:

```sh
cargo install tauri-cli
sudo apt install -y libsoup2.4-dev javascriptcoregtk-4.1 libsoup-3.0 webkit2gtk-4.1 \
                    libjavascriptcoregtk-4.0-dev libwebkit2gtk-4.0-dev librsvg2-dev
```

## Available Commands

| Command                 | Description                                                |
|-------------------------|------------------------------------------------------------|
| `npm run dev`           | Start development server with Vite                         |
| `npm run dev:tauri`     | Start Tauri development server                             |
| `npm run build`         | Build the project for production                           |
| `npm run build:tauri`   | Build the project with tauri                               |
| `npm run preview`       | Preview the built project (requires `npm run build` first) |
| `npm run test`          | Run tests                                                  |
| `npm run test:watch`    | Run tests in watch mode                                    |
| `npm run test:coverage` | Run tests with coverage                                    |
| `npm run test:e2e`      | Run tests by playwright                                    |
| `npm run clean`         | Remove generated files                                     |
| `npm run lint-staged`   | Run linting on staged files                                |
| `npm run prepare`       | Set up Husky for Git hooks                                 |

## Scaling Library

* xBRjs (Copyright 2020 Josep del Rio)
  * https://github.com/joseprio/xBRjs
