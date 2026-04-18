---
name: plugin
description: View and manage installed Claude plugins via cpm
---

# /plugin — Claude Plugin Manager

List, inspect, and manage plugins installed via `cpm`.

## List installed plugins

Run in terminal:

```bash
cpm list
```

Shows all plugins in `~/.claude/plugins/cache/` with name, version, author, and supported targets.

## Install a plugin

```bash
cpm install <github-url>
```

## Search registry

```bash
cpm search [query]
```

## Remove a plugin

```bash
cpm remove <name>
```

## Check auth

```bash
cpm auth status
```

## Interactive mode

```bash
cpm
```

## Setup (if cpm not installed)

```bash
npm install -g claude-plugin-manager
```
