// @doc: docs/daten/economy/resource-store.md#resource-store
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

export function blockedOverflow(resource, stock, gain) {
  if (gain <= 0) return { stock: clampedStock(resource, stock), accepted: 0 };
  const room = Math.max(0, storeCapacity(resource) - stock);
  const accepted = Math.min(room, gain);
  return { stock: stock + accepted, accepted };
}
