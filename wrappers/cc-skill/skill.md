---
name: cpm
description: Install and manage community Claude plugins from GitHub or the registry
---

# Claude Plugin Manager (cpm)

Install community Claude plugins — skills, MCP servers, hooks, and Cowork plugins — from any GitHub repo or the community registry.

## Commands

Run in your terminal:

```bash
cpm                         # interactive mode (menu-driven)
cpm install <github-url>    # install plugin from GitHub URL
cpm search [query]          # search community registry
cpm list                    # list all installed plugins
cpm remove <name>           # uninstall a plugin
cpm auth set-token <token>  # store GitHub PAT (private repos)
cpm auth status             # check stored token
cpm auth remove             # remove stored token
```

## Install Targets

When installing, cpm auto-detects what a plugin supports:

| Target | Installs |
|---|---|
| `cc-skill` | Skill file → `~/.claude/plugins/cache/` |
| `cc-mcp` | MCP server → `~/.claude/settings.json` |
| `cc-hook` | Hook → `~/.claude/settings.json` |
| `cowork` | Plugin files → `~/.claude/plugins/cache/` |

## Setup

```bash
npm install -g claude-plugin-manager
```
