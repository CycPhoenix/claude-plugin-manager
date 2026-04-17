# Claude Plugin Manager

Install and manage community Claude plugins — not listed on the official marketplace — from GitHub or a community registry.

## Install

```bash
npm install -g claude-plugin-manager
```

Or run without installing:

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
cpm install <url>           # install from GitHub URL or direct .json URL
cpm search [query]          # browse or search the community registry
cpm list                    # list installed plugins
cpm remove <name>           # uninstall a plugin
cpm auth set-token <token>  # store GitHub PAT (for private repos)
cpm auth status             # check stored token
cpm auth remove             # remove stored token
```

## Install Targets

When installing, cpm detects which targets the plugin supports and lets you choose:

| Target | What it installs |
|---|---|
| **Cowork Plugin** | Files to `~/.claude/plugins/cache/` |
| **Claude Code Skill** | `.md` skill file to `~/.claude/plugins/cache/` |
| **Claude Code MCP** | Server entry in `~/.claude/settings.json` |
| **Claude Code Hook** | Hook entry in `~/.claude/settings.json` |

## Private Repos

Store a GitHub personal access token with repo read scope:

```bash
cpm auth set-token ghp_yourtoken
```

## Building a Plugin

Add a `manifest.json` to your GitHub repo:

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

See [CONTRIBUTING.md](CONTRIBUTING.md) to add it to the registry.

## License

MIT
