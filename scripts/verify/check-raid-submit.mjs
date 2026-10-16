/** Der Feral-Weg ohne Datenbank: Ausstellung, Einreichung, Absage. */
import { check, section } from './expect.mjs';
import { issueTicket } from '../server/raid-ticket-http.mjs';
import { validateSubmission } from '../server/raid-http.mjs';
import { schwarm } from './raid-kader-fixture.mjs';
import { raidLogFor } from './raid-log-fixture.mjs';
import { envelope } from './raid-account-fixture.mjs';
import { SNAPSHOT_WRITE } from '../../src/state/snapshot-rule.js';

function speicher(rows) {
  return {
    getState: async () => envelope({ dunglings: schwarm() }),
    getAccount: async () => null,
    putTicket: async (id, row) => rows.set(id, row),
    getTicket: async (id) => rows.get(id) ?? null,
    getBooking: async () => null,
    takeTicket: async (args) => { rows.set('genommen', args); return SNAPSHOT_WRITE.ok; },
  };
}

function ids(swarm) {
  return swarm.map((worker) => worker.id);
}

async function feralTicket(store, swarm) {
  const antwort = await issueTicket(store, { account: 'raider', body: { defender: 'feral', heroes: ids(swarm) } });
  if (antwort.status !== 201) throw new Error(`Keine Ausstellung: ${antwort.status} ${antwort.error ?? ''}`);
  return antwort.ticket;
}

async function checkAusstellung() {
  section('Raid-Buchung: Feral-Ausstellung');
  const rows = new Map();
  const store = speicher(rows);
  const swarm = schwarm();
  const erstes = await feralTicket(store, swarm);
  check('Der Feral bekommt ein Ticket', erstes.defender === 'feral' && Number.isInteger(erstes.snapshotSeed), `${erstes.defender}`);
  const zweites = await feralTicket(store, swarm);
  check('Dasselbe Paar bekommt denselben Anmarsch', JSON.stringify(zweites.entry) === JSON.stringify(erstes.entry));
  check('Die Zeile liegt beim Speicher', rows.get(erstes.id)?.ticket?.defender === 'feral');
}

async function checkEinreichung() {
  section('Raid-Buchung: Einreichung und Absage');
  const rows = new Map();
  const store = speicher(rows);
  const ticket = await feralTicket(store, schwarm());
  const lauf = raidLogFor({ ticket });
  const quittung = await validateSubmission(store, { account: 'raider', body: { ticket, actions: lauf.actions, claimed: lauf.claimed } });
  check('Der echte Lauf wird gebucht', quittung.status === 200 && quittung.ok === true, `${quittung.status}`);
  check('Die Quittung nennt die Beute', quittung.loot?.essence === lauf.loot.loot.essence, `${quittung.loot?.essence}`);
  check('Die Buchung hängt am Feral', rows.get('genommen')?.booking?.defender === 'feral');
  const falsch = await validateSubmission(store, { account: 'raider', body: { ticket, actions: [{ type: 'NOPE' }], claimed: lauf.claimed } });
  check('Das falsche Log fällt durch', falsch.status === 422 && falsch.ok === false, `${falsch.status}`);
  const fremd = await validateSubmission(store, { account: 'raider', body: { ticket: { id: 'gibtsnicht' }, actions: [], claimed: null } });
  check('Ohne Zeile gibt es keine Buchung', fremd.status === 404, `${fremd.status}`);
}

export async function checkRaidSubmit() {
  await checkAusstellung();
  await checkEinreichung();
}
