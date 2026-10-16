/** Das Ticket ausstellen: der Angreifer nennt seine Dunglinge, der Server
 *  rechnet Eintrittspunkt und Verteidiger-Seed und legt die Zeile an (D18, D24).
 *  Der Eintrittspunkt haengt am Paar — wer zweimal fragt, bekommt denselben
 *  Anmarsch und keine zweite Zeile (D46). Der Kader kommt aus dem gespeicherten
 *  Heimatstand. Kein Wurf: jede Absage ist ein Ergebnis. */
import { ACCOUNT_CONFIG, normalizeName } from './account-config.mjs';
import { newToken } from './account-session.mjs';
import { NO_STATE, isEnvelope } from './state-http.mjs';
import { cadreRule, ticketFrom } from '../../src/domain/raid/raid-ticket.js';
import { textSeed } from '../../src/domain/raid/raid-spawn-seed.js';

export const NO_DEFENDER = 'Kein Konto.';
export const NO_SNAPSHOT = 'Kein Spielstand beim Verteidiger.';
export const NO_ENTRY = 'Kein freier Eintritt im fremden Dungeon.';

export const FERAL_DEFENDER = 'feral';

function feralSeed(account) {
  return textSeed(`${FERAL_DEFENDER}|${account}`);
}

async function issueFeral(store, { account, heim, heroes }) {
  const cadre = cadreRule({ heroes, dunglings: heim.state.dunglings });
  if (!cadre.ok) return { status: 422, error: cadre.reason };
  return stelltAus(store, { account, defender: FERAL_DEFENDER, seed: feralSeed(account), heroes: cadre.heroes });
}

async function stelltAus(store, { account, defender, seed, heroes }) {
  const ticket = ticketFrom({ id: newToken(), attackerId: account, defenderId: defender, defenderSeed: seed, heroes });
  if (!ticket) return { status: 409, error: NO_ENTRY };
  const expiresAt = Date.now() + ACCOUNT_CONFIG.ticketTtlMs;
  await store.putTicket(ticket.id, { account, defender, ticket, expiresAt });
  return { status: 201, ticket, expiresAt };
}

export async function issueTicket(store, { account, body }) {
  const heim = await store.getState(account);
  if (!isEnvelope(heim)) return { status: 404, error: NO_STATE };
  if (normalizeName(body?.defender) === FERAL_DEFENDER) return issueFeral(store, { account, heim, heroes: body?.heroes });
  const verteidiger = await store.getAccount(normalizeName(body?.defender));
  if (!verteidiger) return { status: 404, error: NO_DEFENDER };
  const lage = await store.getState(verteidiger.name);
  if (!isEnvelope(lage)) return { status: 404, error: NO_SNAPSHOT };
  const cadre = cadreRule({ heroes: body?.heroes, dunglings: heim.state.dunglings });
  if (!cadre.ok) return { status: 422, error: cadre.reason };
  const ticket = ticketFrom({
    id: newToken(),
    attackerId: account,
    defenderId: verteidiger.name,
    defenderSeed: lage.state.world.seed,
    heroes: cadre.heroes,
  });
  if (!ticket) return { status: 409, error: NO_ENTRY };
  const expiresAt = Date.now() + ACCOUNT_CONFIG.ticketTtlMs;
  await store.putTicket(ticket.id, { account, defender: verteidiger.name, ticket, expiresAt });
  return { status: 201, ticket, expiresAt };
}
