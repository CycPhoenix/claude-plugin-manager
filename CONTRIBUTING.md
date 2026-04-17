# Contributing

## Adding Your Plugin to the Registry

1. Fork [claude-plugin-manager/registry](https://github.com/claude-plugin-manager/registry)
2. Add your plugin to `registry.json`:

```json
{
  "name": "your-plugin-name",
  "description": "What it does (one line)",
  "author": "your-github-username",
  "url": "https://github.com/your-username/your-plugin",
  "tags": ["productivity"]
}
```

3. Open a pull request

## Plugin Requirements

Your repo must have a `manifest.json` at the root. See the README for the schema.

## Contributing to cpm itself

1. Fork this repo
2. `npm install`
3. Write tests first: `npm run test:watch`
4. Open a PR against `main`

All PRs require passing CI (tests on Node 18 + 20, Windows + Mac + Linux).
