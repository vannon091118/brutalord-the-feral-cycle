// @doc: docs/daten/ui/hivepanel.md#hivepanel
import { dunglingMood } from '../domain/entities/dungling.js';
import { headOrder } from '../domain/orders/order.js';

function orderText(worker) {
  const order = headOrder(worker);
  if (worker.job) return `${worker.job.kind} ${worker.job.phase}`;
  if (order) return `${order.kind} ${order.buildingId}`;
  return 'ohne Auftrag';
}

function storeOf(worker, hiveId) {
  return worker.job?.storeId ?? headOrder(worker)?.storeId ?? worker.storeId ?? hiveId;
}

function DunglingRow({ worker, stores, hiveId, onPickStore }) {
  const idle = !worker.job && worker.orders.length === 0;
  const current = storeOf(worker, hiveId);
  const label = stores.find((store) => store.id === current)?.label ?? current;
  const next = stores[(stores.findIndex((store) => store.id === current) + 1) % stores.length] ?? null;
  return (
    <li className="flex items-baseline justify-between gap-2 px-0.5 py-1 text-[11px]">
      <span className="text-bone-100">{worker.id}</span>
      <span className="text-bone-400">{idle ? 'unbeschäftigt' : 'beschäftigt'} · {worker.state}</span>
      <span className="truncate text-bone-400">{orderText(worker)}</span>
      <span className="text-[var(--dl-live)]">{dunglingMood(worker)}</span>
      <button
        type="button"
        disabled={!next || next.id === current}
        title={next && next.id !== current ? `Lager wechseln zu ${next.label}` : 'Der Hive ist das einzige Lager'}
        onClick={() => onPickStore(worker.id, next.id)}
        className="shrink-0 rounded-full border border-bone-400/20 px-2 py-[2px] text-[10px] text-bone-300 transition hover:border-core-400/40 disabled:opacity-40"
      >
        {label}
      </button>
    </li>
  );
}

export function HivePanel({ stock, capacity, housed, housing, orderCost, canOrder, orderHint, dunglings, stores, hiveId, onPickStore, onOrder, onClose }) {
  return (
    <section className="dl-panel dl-panel-in w-[min(92vw,352px)] rounded-[var(--radius-dl)] px-3 pb-3 pt-2.5" aria-label="Hive-Übersicht">
      <header className="flex items-baseline justify-between px-0.5 pb-2">
        <h2 className="text-[13px] font-semibold tracking-wide text-bone-100">Hive</h2>
        <span className="text-[10px] text-bone-400">◆ {stock} / {capacity} · Wohnraum {housed} / {housing}</span>
      </header>
      <button
        type="button"
        onClick={onOrder}
        disabled={!canOrder}
        title={orderHint}
        className="w-full rounded-lg border border-core-400/40 bg-core-500/15 px-2.5 py-1.5 text-[11px] text-core-200 transition hover:bg-core-500/25 disabled:opacity-40"
      >
        Dungling bestellen ({orderCost} Essenz)
      </button>
      <ul className="pt-1">
        {dunglings.map((worker) => <DunglingRow key={worker.id} worker={worker} stores={stores} hiveId={hiveId} onPickStore={onPickStore} />)}
      </ul>
      <button
        type="button"
        onClick={onClose}
        className="mt-1 w-full rounded-lg border border-bone-400/15 px-2.5 py-1 text-[11px] text-bone-300 transition hover:border-core-400/40"
      >
        Schließen
      </button>
    </section>
  );
}
