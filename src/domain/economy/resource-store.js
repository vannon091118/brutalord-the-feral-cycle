// @doc: docs/daten/economy/resource-store.md#resource-store
import { findPath } from '../labour/lanes.js';

export const STORE_RESOURCE = Object.freeze({
  ESSENCE: 'essence',
});

const STORE_CAPACITY = Object.freeze({
  [STORE_RESOURCE.ESSENCE]: 60,
});

export function storeCapacity(resource) {
  return STORE_CAPACITY[resource] ?? 0;
}

export function clampedStock(resource, stock) {
  return Math.max(0, Math.min(stock, storeCapacity(resource)));
}

export function nearestStoreId(stores, from) {
  if (!Array.isArray(stores) || stores.length === 0) return null;
  let best = stores[0].id;
  let bestLen = Infinity;
  for (const store of stores) {
    const path = findPath(from, store.at);
    const len = path ? path.length : Math.abs(store.at.x - from.x) + Math.abs(store.at.y - from.y);
    if (len < bestLen) {
      bestLen = len;
      best = store.id;
    }
  }
  return best;
}

export function blockedOverflow(resource, stock, gain) {
  if (gain <= 0) return { stock: clampedStock(resource, stock), accepted: 0 };
  const room = Math.max(0, storeCapacity(resource) - stock);
  const accepted = Math.min(room, gain);
  return { stock: stock + accepted, accepted };
}
