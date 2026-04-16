'use strict';

const { fetchFromUrl } = require('./fetcher');
const { validateManifest, detectTargets } = require('./detector');
const ccSkill = require('../targets/cc-skill');
const ccMcp = require('../targets/cc-mcp');
const ccHook = require('../targets/cc-hook');
const cowork = require('../targets/cowork');

const TARGET_HANDLERS = {
  'cc-skill': ccSkill,
  'cc-mcp': ccMcp,
  'cc-hook': ccHook,
  cowork
};

async function installPlugin(url, chosenTargets, token = null) {
  const { manifest, files } = await fetchFromUrl(url, token);
  validateManifest(manifest);
  const detected = detectTargets(manifest);

  const results = [];
  for (const target of chosenTargets) {
    if (!detected.includes(target)) {
      throw new Error(`target ${target} not supported by this plugin (supports: ${detected.join(', ')})`);
    }
    const handler = TARGET_HANDLERS[target];
    const result = await handler.install(manifest, files);
    results.push({ target, ...result });
  }
  return results;
}

module.exports = { installPlugin };
