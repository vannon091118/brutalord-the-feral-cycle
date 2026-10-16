// @doc: docs/daten/orders/order.md#order
import { ORDER_CONFIG } from './order-config.js';

export function createOrder({ kind, buildingId, storeId = null }) {
  return { kind, buildingId, storeId };
}

export function pushOrder(worker, order) {
  if (!order || worker.orders.length >= ORDER_CONFIG.queueMax) return worker;
  return { ...worker, orders: [...worker.orders, order] };
}

export function dropOrder(worker) {
  if (worker.orders.length === 0) return worker;
  return { ...worker, orders: worker.orders.slice(1) };
}

export function clearOrders(worker) {
  return worker.orders.length === 0 ? worker : { ...worker, orders: [] };
}

export function headOrder(worker) {
  return worker.orders.at(0) ?? null;
}
