'use strict';

const https = require('https');

const REGISTRY_URL = 'https://raw.githubusercontent.com/claude-plugin-manager/registry/main/registry.json';

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch registry: HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchRegistry() {
  const raw = await httpsGet(REGISTRY_URL);
  return JSON.parse(raw);
}

function searchRegistry(registry, query) {
  if (!query) return registry;
  const q = query.toLowerCase();
  return registry.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q)) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
  );
}

module.exports = { fetchRegistry, searchRegistry };
