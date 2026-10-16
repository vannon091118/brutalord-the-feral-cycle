// @doc: docs/daten/reducers/raid-reducer.md#raid-reducer
import { ACTION } from '../../domain/actions/action-types.js';
import { createRaidState } from '../../domain/raid/raid-state.js';
import { createRaidWorld } from '../../domain/raid/raid-world.js';
import { applyAction } from '../../domain/raid/raid-steps.js';
import { applyRaidLoot } from '../../domain/raid/raid-loot.js';
import { settleRaid } from '../../domain/raid/raid-outcome.js';

function openRaid(state, ticket) {
  if (state.raid != null || !ticket) return state;
  return { ...state, raid: { ticket, instance: createRaidState(ticket) } };
}

function playRaid(state, verb) {
  if (state.raid == null || !verb) return state;
  const welt = createRaidWorld({ snapshotSeed: state.raid.ticket.snapshotSeed });
  const danach = applyAction(state.raid.instance, welt, verb);
  return danach === state.raid.instance ? state : { ...state, raid: { ...state.raid, instance: danach } };
}

function closeRaid(state, abandoned) {
  if (state.raid == null) return state;
  const abgerechnet = settleRaid(state.raid.instance);
  const heim = abandoned === true || !abgerechnet.loot ? state : applyRaidLoot(state, abgerechnet.loot);
  return { ...heim, raid: null };
}

export function reduceRaid(state, action) {
  if (action.type === ACTION.RAID_STARTED) return openRaid(state, action.ticket);
  if (action.type === ACTION.RAID_ACTION) return playRaid(state, action.action);
  if (action.type === ACTION.RAID_ENDED) return closeRaid(state, action.abandoned);
  return state;
}
