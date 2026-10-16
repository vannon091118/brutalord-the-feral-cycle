// @doc: docs/daten/account/session.md#session
import { readJson, removeKey, writeJson } from '../../state/client-storage.js';

export const SESSION_KEY = 'dl.session';
const SEED = /^[0-9a-f]{16}$/;

function text(value) {
  return typeof value === 'string' ? value : '';
}

function isSeed(value) {
  return typeof value === 'string' && SEED.test(value);
}

export function readSession() {
  const parsed = readJson(SESSION_KEY);
  if (!isSeed(parsed?.playerseed)) return null;
  return { name: text(parsed.name), playerId: text(parsed.playerId), playerseed: parsed.playerseed, token: text(parsed.token) };
}

export function writeSession(session) {
  if (!isSeed(session?.playerseed)) return;
  const clean = { name: text(session.name), playerId: text(session.playerId), playerseed: session.playerseed, token: text(session.token) };
  writeJson(SESSION_KEY, clean);
}

export function clearSession() {
  removeKey(SESSION_KEY);
}