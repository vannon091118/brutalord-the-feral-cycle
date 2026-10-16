// @doc: docs/daten/raid/raid-options.md#raid-options
import { RAID_ACTION, RAID_STEP, neighborOf } from './raid-actions.js';
import { actionsAllowedIn } from './raid-phases.js';
import { applyAction } from './raid-steps.js';
import { RAID_VERB } from './raid-verbs.js';
import { cellCost } from './raid-path.js';
import { tileId } from '../world/tile.js';

const RICHTUNG = Object.freeze(['N', 'E', 'S', 'W']);

function optionFuer(state, world, action) {
  return Object.freeze({ type: action.type, legal: applyAction(state, world, action) !== state });
}

function schrittFuer(state, world, richtung) {
  const ziel = neighborOf(state.at, { type: RAID_ACTION[`MOVE_${richtung}`] });
  const kosten = cellCost(state, world, tileId(ziel.x, ziel.y));
  return Object.freeze({
    richtung,
    zug: optionFuer(state, world, { type: RAID_ACTION[`MOVE_${richtung}`] }),
    hack: Object.freeze({ ...optionFuer(state, world, { type: RAID_ACTION[`DIG_${richtung}`] }), kosten }),
  });
}

function wahlFuer(state, world, verb) {
  const type = verb === RAID_VERB.ATTACK ? RAID_ACTION.ATTACK : verb === RAID_VERB.SACRIFICE ? RAID_ACTION.SACRIFICE : RAID_ACTION.LOOT;
  return optionFuer(state, world, { type });
}

export function raidOptions(state, world) {
  const erlaubt = actionsAllowedIn(state.phase);
  const schritte = RAID_STEP.map((type) => schrittFuer(state, world, type.slice(-1)));
  const wahlen = [RAID_VERB.ATTACK, RAID_VERB.SACRIFICE, RAID_VERB.LOOT].map((verb) => wahlFuer(state, world, verb));
  return Object.freeze({ erlaubt: [...erlaubt], schritte, wahlen });
}
