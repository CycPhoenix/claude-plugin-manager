'use strict';

const https = require('https');
const { Octokit } = require('@octokit/rest');

function parseGitHubUrl(url) {
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\/tree\/([^/]+))?(?:\.git)?(?:\/)?$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2], ref: match[3] || 'main' };
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(httpsGet(res.headers.location));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url}: HTTP ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchFromUrl(url, token = null) {
  const parsed = parseGitHubUrl(url);
  if (parsed) return fetchFromGitHub(parsed.owner, parsed.repo, parsed.ref, token);

  const buf = await httpsGet(url);
  let manifest;
  try {
    manifest = JSON.parse(buf.toString('utf8'));
  } catch {
    throw new Error(`Failed to fetch ${url}: response is not valid JSON`);
  }
  return { manifest, files: { 'manifest.json': buf } };
}

async function fetchFromGitHub(owner, repo, ref = 'main', token = null) {
  const octokit = new Octokit({ auth: token || undefined });
  const { data: tree } = await octokit.git.getTree({
    owner, repo, tree_sha: ref, recursive: 'true'
  });

  const files = {};
  for (const item of tree.tree) {
    if (item.type !== 'blob') continue;
    const { data: blob } = await octokit.git.getBlob({ owner, repo, file_sha: item.sha });
    files[item.path] = Buffer.from(blob.content, 'base64');
  }

  const manifestBuf = files['manifest.json'];
  if (!manifestBuf) throw new Error(`Repository ${owner}/${repo} has no manifest.json`);

  let manifest;
  try {
    manifest = JSON.parse(manifestBuf.toString('utf8'));
  } catch {
    throw new Error(`manifest.json in ${owner}/${repo} is not valid JSON`);
  }

  return { manifest, files };
}

module.exports = { parseGitHubUrl, fetchFromUrl, fetchFromGitHub };
