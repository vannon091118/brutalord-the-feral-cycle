// @doc: docs/daten/state/game-reducer.md#game-reducer
import { COLONY_REDUCERS } from './reducer-chain.js';
import { WORLD_REDUCERS } from './reducer-chain-world.js';
import { STORE_RESOURCE, clampedStock } from '../domain/economy/resource-store.js';

export function gameReducer(state, action) {
  for (const reduce of [...COLONY_REDUCERS, ...WORLD_REDUCERS]) {
    const next = reduce(state, action);
    if (next !== state) return capped(next);
  }
  return state;
}

function capped(state) {
  const stock = clampedStock(STORE_RESOURCE.ESSENCE, state.essence);
  return stock === state.essence ? state : { ...state, essence: stock };
}
