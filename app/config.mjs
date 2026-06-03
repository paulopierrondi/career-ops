import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const APP_DIR = path.dirname(fileURLToPath(import.meta.url));
export const APP_ROOT = path.resolve(APP_DIR, '..');

export function resolveStateDir(env = process.env) {
  return path.resolve(env.CAREER_OPS_STATE_DIR || APP_ROOT);
}

export function dataPaths(stateDir = resolveStateDir()) {
  return {
    root: stateDir,
    cv: path.join(stateDir, 'cv.md'),
    portals: path.join(stateDir, 'portals.yml'),
    profile: path.join(stateDir, 'config', 'profile.yml'),
    profileMode: path.join(stateDir, 'modes', '_profile.md'),
    dataDir: path.join(stateDir, 'data'),
    reportsDir: path.join(stateDir, 'reports'),
    outputDir: path.join(stateDir, 'output'),
    jdsDir: path.join(stateDir, 'jds'),
    applications: path.join(stateDir, 'data', 'applications.md'),
    pipeline: path.join(stateDir, 'data', 'pipeline.md'),
    scanHistory: path.join(stateDir, 'data', 'scan-history.tsv'),
  };
}

export function safeRelativeFile(baseDir, requestedPath) {
  const normalized = path.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.resolve(baseDir, normalized);
  const resolvedBase = path.resolve(baseDir);
  if (!fullPath.startsWith(resolvedBase + path.sep) && fullPath !== resolvedBase) {
    throw new Error('Unsafe path');
  }
  return fullPath;
}
