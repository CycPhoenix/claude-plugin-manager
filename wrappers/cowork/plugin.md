---
name: claude-plugin-manager
description: Install and manage community Claude plugins from GitHub or the registry
---

# Claude Plugin Manager

Install community Claude plugins from GitHub URLs or browse the registry. Supports Claude Code skills, MCP servers, hooks, and Cowork plugins.

## Usage

Run `cpm` in your terminal for interactive mode, or use subcommands:

```bash
cpm install <url>           # install from GitHub URL
cpm search [query]          # browse community registry
cpm list                    # show installed plugins
cpm remove <name>           # uninstall a plugin
cpm auth set-token <token>  # store GitHub PAT for private repos
```

## Install Targets

| Target | What it installs |
|---|---|
| `cc-skill` | Skill file → `~/.claude/plugins/cache/` |
| `cc-mcp` | MCP server → `~/.claude/settings.json` |
| `cc-hook` | Hook → `~/.claude/settings.json` |
| `cowork` | Plugin files → `~/.claude/plugins/cache/` |

## Setup

```bash
npm install -g claude-plugin-manager
```
