/** Die Abrechnung: voller Sieg zahlt die Beute ins gedeckelte Lager. */
import { check, section } from './expect.mjs';
import { createInitialGameState } from '../../src/state/game-state.js';
import { gameReducer } from '../../src/state/game-reducer.js';
import { ACTION } from '../../src/domain/actions/action-types.js';
import { raidLogFor } from './raid-log-fixture.mjs';
import { STORE_RESOURCE, clampedStock } from '../../src/domain/economy/resource-store.js';
import { SEED, ticketFuer } from './check-raid-flow.mjs';

export function checkRaidSettle() {
  section('Raid-Abrechnung: Sieg und Lagerdeckel');
  const ticket = ticketFuer();
  const lauf = raidLogFor({ ticket });
  check('Die Vorlage spielt bis zur Sicherung', lauf.resolved === true && lauf.loot.ok === true);
  const heim = createInitialGameState(SEED);
  let stand = gameReducer(heim, { type: ACTION.RAID_STARTED, ticket });
  for (const action of lauf.actions) stand = gameReducer(stand, { type: ACTION.RAID_ACTION, action });
  check('Der Reducer erreicht dieselbe Sicherung', stand.raid?.instance?.secured === true);
  const kassiert = gameReducer(stand, { type: ACTION.RAID_ENDED, abandoned: false });
  const raum = clampedStock(STORE_RESOURCE.ESSENCE, heim.essence + lauf.loot.loot.essence);
  check('Die Beute landet im gedeckelten Lager', kassiert.essence === raum, `${kassiert.essence} gegen ${raum}`);
  check('Die Abrechnung nennt die volle Beute', kassiert.lastRaid?.loot?.essence === lauf.loot.loot.essence && kassiert.lastRaid?.abandoned === false);
}
