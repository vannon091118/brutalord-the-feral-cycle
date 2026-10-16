/** Vorbereitung und Abbruch: der Raid öffnet und schließt sauber durch den Reducer. */
import { check, section } from './expect.mjs';
import { createInitialGameState } from '../../src/state/game-state.js';
import { gameReducer } from '../../src/state/game-reducer.js';
import { ACTION } from '../../src/domain/actions/action-types.js';
import { cadreRule, feralTicketArgs, ticketFrom } from '../../src/domain/raid/raid-ticket.js';
import { schwarm } from './raid-kader-fixture.mjs';

export const SEED = 'a1b2c3d4';

export function ticketFuer() {
  const swarm = schwarm();
  const kader = cadreRule({ heroes: swarm.map((worker) => worker.id), dunglings: swarm });
  if (!kader.ok) throw new Error(`Kader abgewiesen: ${kader.reason}`);
  return ticketFrom(feralTicketArgs({ playerseed: SEED, heroes: kader.heroes }));
}

function checkVorbereitung() {
  section('Raid-Flow: Vorbereitung');
  const swarm = schwarm();
  const kader = cadreRule({ heroes: swarm.map((worker) => worker.id), dunglings: swarm });
  check('Der Schwarm stellt einen Kader', kader.ok === true, kader.reason ?? '');
  const ticket = ticketFuer();
  check('Der Feral-Gegner bekommt ein Ticket', ticket !== null && ticket.snapshotSeed > 0, `${ticket?.snapshotSeed}`);
  const heim = gameReducer(createInitialGameState(SEED), { type: ACTION.RAID_STARTED, ticket });
  check('STARTED öffnet den Raid', heim.raid?.instance?.phase === 'ENTER', `${heim.raid?.instance?.phase}`);
}

function checkAbbruch() {
  section('Raid-Flow: Abbruch');
  const heim = createInitialGameState(SEED);
  const offen = gameReducer(heim, { type: ACTION.RAID_STARTED, ticket: ticketFuer() });
  const begonnen = gameReducer(offen, { type: ACTION.RAID_ACTION, action: { type: 'MOVE_E' } });
  const abgebrochen = gameReducer(begonnen, { type: ACTION.RAID_ENDED, abandoned: true });
  check('Der Abbruch schließt den Raid', abgebrochen.raid === null);
  check('Der Abbruch zahlt nichts', abgebrochen.essence === heim.essence);
  check('Der Abbruch steht in der Abrechnung', abgebrochen.lastRaid?.abandoned === true && abgebrochen.lastRaid?.loot === null);
}

export function checkRaidFlow() {
  checkVorbereitung();
  checkAbbruch();
}
