// @doc: docs/daten/raid/raid-outcome.md#raid-outcome
import { raidLoot } from './raid-loot.js';

export const RAID_RANK = Object.freeze({ PENDING_MMR: 'MMR_AUSSTEHEND' });

export function defenderLoss() {
  return Object.freeze({ essence: 0, bloodstone: 0, rank: RAID_RANK.PENDING_MMR });
}

export function attackerSpoils(state) {
  const quittung = raidLoot(state);
  return quittung.ok ? quittung.loot : null;
}

export function retrievalOpen(state) {
  return state.lost === true && state.sacrificed.length > 0;
}

export function settleRaid(state) {
  return Object.freeze({
    loot: attackerSpoils(state),
    defender: defenderLoss(),
    sacrificed: [...state.sacrificed],
    retrieval: retrievalOpen(state),
  });
}
