// @doc: docs/daten/ui/raid-submit.md#raid-submit
import { cadreRule, feralTicketArgs, ticketFrom } from '../domain/raid/raid-ticket.js';

export const FERAL_DEFENDER = 'feral';

const NO_SERVER = 'Der Konto-Server antwortet nicht — der Raid läuft lokal, die Quittung bleibt aus.';
const NO_SESSION = 'Diese Sitzung kennt der Server nicht mehr — bitte neu anmelden.';

async function postJson(token, path, body) {
  let response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, error: NO_SERVER };
  }
  const payload = await response.json().catch(() => null);
  if (!payload || typeof payload !== 'object') return { ok: false, error: NO_SERVER };
  if (response.status === 401) return { ok: false, error: NO_SESSION };
  if (!response.ok || payload.ok === false) return { ok: false, error: String(payload.error ?? NO_SERVER) };
  return { ok: true, payload };
}

export async function issueRaidTicket(token, { defender, heroes }) {
  const antwort = await postJson(token, '/api/raid/ticket', { defender, heroes });
  if (!antwort.ok) return antwort;
  if (!antwort.payload.ticket) return { ok: false, error: NO_SERVER };
  return { ok: true, ticket: antwort.payload.ticket };
}

export async function submitRaid(token, { ticket, actions, claimed }) {
  const antwort = await postJson(token, '/api/raid', { ticket, actions, claimed });
  if (!antwort.ok) return antwort;
  return { ok: true, loot: antwort.payload.loot ?? null, gebucht: antwort.payload.gebucht === true };
}

export async function startRaidAgainst(token, { playerseed, dunglings, defender }) {
  const ids = (dunglings ?? []).map((worker) => worker.id);
  const regel = cadreRule({ heroes: ids, dunglings });
  if (!regel.ok) return { ticket: null, note: regel.reason };
  const ausweis = await issueRaidTicket(token, { defender, heroes: ids });
  if (ausweis.ok) return { ticket: ausweis.ticket, note: null };
  if (ausweis.error === NO_SERVER) {
    const heim = ticketFrom(feralTicketArgs({ playerseed, heroes: regel.heroes }));
    if (!heim) return { ticket: null, note: 'Kein Einmarsch in den Feral-Hive gefunden.' };
    return { ticket: heim, note: 'Ohne Server gegen den Feral-Hive — die Quittung bleibt aus.' };
  }
  return { ticket: null, note: ausweis.error };
}
