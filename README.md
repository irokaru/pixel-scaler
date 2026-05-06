<div align="center">  
  <a href="https://irokaru.github.io/pixel-scaler/">
    <img src="./public/logo.png" width="33%" alt="Pixel Scaler Logo"/>
  </a>
  <p><b>A pixel art upscaling tool</b></p>

  <!-- Badges -->
  <p>
    <a href="https://github.com/irokaru/pixel-scaler/releases/latest"><img src="https://img.shields.io/github/v/release/irokaru/pixel-scaler.svg?style=for-the-badge" alt="Latest Release"/></a>
    <img src="https://img.shields.io/github/downloads/irokaru/pixel-scaler/total?style=for-the-badge" alt="Downloads"/>
    <a href="https://app.codecov.io/gh/irokaru/pixel-scaler/tree/main"><img src="https://img.shields.io/codecov/c/github/irokaru/pixel-scaler?style=for-the-badge" alt="Coverage"/></a>
    <a href="https://x.com/IroKaru"><img src="https://img.shields.io/twitter/follow/irokaru?style=for-the-badge" alt="Follow on X"/></a>
    <a href="https://ko-fi.com/B0B81Z3389"><img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Ko-fi"/></a>
  </p>
</div>

## Development Environment

* bun (>= 1.1.0)
* rust (>=1.85.0)
  * (required for Tauri development)

## Setup for Development (WSL)

If you use mise, you can set up the development environment with the following command:

```sh
mise install
```

Install dependencies:

```sh
bun install
```

(Optional) If you want to use Tauri:

```sh
cargo install tauri-cli
# NOTE: https://v2.tauri.app/start/prerequisites/
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
```

## Available Commands

| Command                  | Description                                                 |
|--------------------------|-------------------------------------------------------------|
| `bun run dev`            | Start development server with Vite                          |
| `bun run dev:tauri`      | Start Tauri development server                              |
| `bun run build`          | Build the project for production                            |
| `bun run build:tauri`    | Build the project with tauri                                |
| `bun run preview`        | Preview the built project (requires `bun run build` first)  |
| `bun run test`           | Run tests                                                   |
| `bun run test:watch`     | Run tests in watch mode                                     |
| `bun run test:coverage`  | Run tests with coverage                                     |
| `bun run test:e2e`       | Run tests by playwright                                     |
| `bun run clean`          | Remove generated files                                      |
| `bun run lint-staged`    | Run linting on staged files                                 |
| `bun run prepare`        | Set up Husky for Git hooks                                  |

## Scaling Library

* xBRjs (Copyright 2020 Josep del Rio)
  * https://github.com/joseprio/xBRjs
