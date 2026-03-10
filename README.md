# large-tty

### Large Type Over SSH

`large-tty` is a tiny Bubble Tea app that renders your input as large ASCII art (figlet-style) and serves it over SSH — so anyone can jump in with:

```bash
ssh large-tty.com
```

Now also available as a web app at [large-tty.com](https://large-tty.com).

Inspired by [large-type.com](https://large-type.com).

## Demo

https://github.com/user-attachments/assets/115bb2b4-9178-444d-9f80-8819ffc072aa

### Built With

![Go Badge](https://img.shields.io/badge/Go-00ADD8?logo=go&logoColor=fff&style=for-the-badge)
![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge)
![TanStack Badge](https://img.shields.io/badge/TanStack-FF4154?logo=reactquery&logoColor=fff&style=for-the-badge)
![Tailwind Badge](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=fff&style=for-the-badge)

**Terminal (Go)**

- **TUI** - [Charm Bubble Tea](https://charm.land/bubbletea) + [Bubbles](https://charm.land/bubbles)
- **Styling** - [Lip Gloss](https://charm.land/lipgloss)
- **SSH** - [Charm Wish](https://charm.land/wish)
- **Figlet** - [go-figure](https://github.com/common-nighthawk/go-figure)

**Web (TypeScript)**

- **Framework** - [TanStack Start](https://tanstack.com/start) + [React 19](https://react.dev)
- **Routing** - [TanStack Router](https://tanstack.com/router) (file-based)
- **Styling** - [Tailwind CSS v4](https://tailwindcss.com)
- **Figlet** - [figlet.js](https://github.com/patorjk/figlet.js) (100+ fonts, lazy-loaded)

## Features

### Large ASCII Output

- **Multiple Fonts** - `standard`, `slant`, `big`, `larry3d`, `colossal`, `doom`, etc.
- **Auto Shrink** - Falls back to smaller fonts when output won’t fit the terminal

### Terminal-Friendly Layout

- **Responsive & Centered** - Adapts to terminal window size and stays centered
- **Wrapping** - Output wraps cleanly when needed

### Web App

- **Keyboard Shortcuts** - Powered by [TanStack Hotkeys](https://tanstack.com/hotkeys) — `Tab` / `Shift+Tab` to cycle fonts, `Ctrl+R` for random, `Enter` to clear
- **Responsive Figlet Wrapping** - Measures true monospace column width via ResizeObserver to wrap output perfectly

## Prerequisites

- **Go 1.25+** - [Download here](https://golang.org/dl/)
- **Node.js 22+** & **pnpm** - for the web app

## Getting Started

### Web

```bash
cd web
pnpm install
pnpm dev            # localhost:3000
```

### Terminal

```bash
go install github.com/mamuzad/large-tty/cmd/large-tty@latest
large-tty           # run the TUI
```

Or run the SSH server (port 2222):

```bash
go run ./cmd/large-tty-ssh
ssh -p 2222 localhost
```
