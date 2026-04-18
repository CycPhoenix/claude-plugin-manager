# Claude Plugin Manager (cpm)

**cpm** is a CLI tool that installs community Claude plugins from GitHub or a registry into Claude Code and Cowork — no official marketplace required.

## Key Features

- **Install from any GitHub repo** — paste a URL, cpm handles the rest
- **Auto-detects install targets** — skills, MCP servers, hooks, Cowork plugins
- **Community registry** — search and browse available plugins
- **Private repo support** — store a GitHub PAT securely via OS keychain
- **Interactive TUI** — run `cpm` with no args for guided menu

## Install

```bash
npm install -g claude-plugin-manager
```

Or without installing:

```bash
npx claude-plugin-manager
```

## Usage

### Interactive mode

```bash
cpm
```

### Subcommands

```bash
cpm install <url>           # install from GitHub URL
cpm search [query]          # browse community registry
cpm list                    # show installed plugins
cpm remove <name>           # uninstall a plugin
cpm auth set-token <token>  # store GitHub PAT (private repos)
cpm auth status             # check stored token
cpm auth remove             # remove stored token
```

## Install Targets

cpm detects which targets a plugin supports and lets you choose:

| Target | What it installs |
|---|---|
| `cc-skill` | Skill `.md` file → `~/.claude/plugins/cache/` |
| `cc-mcp` | MCP server entry → `~/.claude/settings.json` |
| `cc-hook` | Hook entry → `~/.claude/settings.json` |
| `cowork` | Plugin files → `~/.claude/plugins/cache/` |

## Building a Plugin

Add a `manifest.json` to your GitHub repo root:

```json
{
  "name": "your-plugin",
  "version": "1.0.0",
  "description": "What your plugin does",
  "author": "your-github-username",
  "targets": {
    "cc-skill": { "file": "skill.md" }
  }
}
```

Multiple targets supported:

```json
{
  "targets": {
    "cc-skill": { "file": "skill.md" },
    "cc-mcp": { "server": { "command": "node", "args": ["server.js"] } },
    "cc-hook": { "event": "PostToolUse", "command": "node hook.js" },
    "cowork": { "files": ["plugin.md", "manifest.json"] }
  }
}
```

Submit to the registry: see [CONTRIBUTING.md](CONTRIBUTING.md).

## Private Repos

```bash
cpm auth set-token ghp_yourtoken
```

Token stored securely via OS keychain (keytar) with JSON file fallback.

## License

MIT
