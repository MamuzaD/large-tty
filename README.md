# large-tty

### Large Type Over SSH

`large-tty` is a tiny Bubble Tea app that renders your input as large ASCII art (figlet-style) and serves it over SSH — so anyone can jump in with:

```bash
ssh large-tty.com
```

Inspired by [large-type.com](https://large-type.com), but built for the terminal.

## Demo

### Built With

![Go Badge](https://img.shields.io/badge/Go-00ADD8?logo=go&logoColor=fff&style=for-the-badge)

- **TUI** - [Charm Bubble Tea](https://github.com/charmbracelet/bubbletea) + [Bubbles](https://github.com/charmbracelet/bubbles)
- **Styling** - [Lipgloss](https://github.com/charmbracelet/lipgloss)
- **SSH** - [Charm Wish](https://github.com/charmbracelet/wish)
- **Figlet** - [go-figure](https://github.com/common-nighthawk/go-figure)

## Features

### Large ASCII Output

- **Multiple Fonts** - `standard`, `slant`, `big`, `larry3d`, `colossal`, `doom`, etc.
- **Auto Shrink** - Falls back to smaller fonts when output won’t fit the terminal

### Terminal-Friendly Layout

- **Responsive & Centered** - Adapts to terminal window size and stays centered
- **Wrapping** - Output wraps cleanly when needed

## Prerequisites

- **Go 1.25+** - [Download here](https://golang.org/dl/)

## Installation

### Option 1: Go Install (Recommended)

```bash
go install github.com/mamuzad/large-tty/cmd/large-tty@latest
```

### Option 2: Build from Source

```bash
git clone https://github.com/mamuzad/large-tty.git
cd large-tty
go build ./...
```

## Quick Start

### 1. Run locally (TUI)

```bash
large-tty
```

Or without installing:

```bash
go run ./cmd/large-tty
```

### 2. Run the SSH server

Listens on **port 2222** by default:

```bash
go run ./cmd/large-tty-ssh
```

Connect:

```bash
ssh -p 2222 localhost
```

## Todo

- [ ] Deploy SSH server to a VPS
- [ ] Settings view (font selection, sizing rules)
- [ ] Improve fit heuristics for extreme terminal sizes
