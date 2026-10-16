// @doc: docs/daten/ui/raidpanel.md#raidpanel
import { useMemo, useRef, useState } from 'react';
import { cadreRule } from '../domain/raid/raid-ticket.js';
import { FERAL_DEFENDER, startRaidAgainst, submitRaid } from './raid-submit.js';
import { createRaidWorld } from '../domain/raid/raid-world.js';
import { raidOptions } from '../domain/raid/raid-options.js';
import { approachSteps } from '../domain/raid/raid-config.js';
import { settleRaid } from '../domain/raid/raid-outcome.js';

const PFEIL = Object.freeze({ N: '↑', E: '→', S: '↓', W: '←' });
const TAT = Object.freeze({ ATTACK: 'Angreifen', SACRIFICE: 'Opfern', LOOT: 'Plündern' });
const HINWEIS = Object.freeze({
  ENTER: 'Zum Hive marschieren und die Wächter stellen.',
  COMBAT: 'Die Wächter binden die Gruppe — angreifen.',
  WARDEN_DOWN: 'Der Weg ist frei — opfern oder plündern.',
  SACRIFICE: 'Opfer gebracht — jetzt plündern.',
  LOOT: 'Beute getragen — zum Eintritt zurückkehren.',
  EXTRACTING: 'Rückzug läuft — den Eintritt erreichen.',
  RESOLVED: 'Entschieden.',
});

function Rahmen({ titel, untertitel, children }) {
  return (
    <section className="dl-panel dl-panel-in w-[min(92vw,320px)] rounded-2xl px-3 pb-3 pt-2.5" aria-label="Raid">
      <header className="flex items-baseline gap-2 px-0.5 pb-2">
        <h2 className="text-[13px] font-semibold tracking-wide text-bone-100">{titel}</h2>
        <span className="text-[10px] text-bone-400">{untertitel}</span>
      </header>
      {children}
    </section>
  );
}

function Zeile({ label, text, schwach }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="shrink-0 text-bone-400">{label}</dt>
      <dd className={`text-right ${schwach ? 'text-bone-300' : 'text-bone-100'}`}>{text}</dd>
    </div>
  );
}

function Knopf({ text, aktiv, onClick }) {
  return (
    <button
      type="button"
      disabled={!aktiv}
      onClick={onClick}
      className="rounded-lg border border-bone-400/20 px-2 py-1 text-[11px] text-bone-200 transition-colors hover:border-core-400/40 hover:text-bone-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {text}
    </button>
  );
}

function StartAbschnitt({ dunglings, playerseed, token, onStart }) {
  const [fehler, setFehler] = useState(null);
  const regel = cadreRule({ heroes: dunglings.map((worker) => worker.id), dunglings });
  const text = regel.ok ? `${regel.heroes.length} Wesen · ${regel.grit} Grit` : regel.reason;
  const starten = async () => {
    const { ticket, note } = await startRaidAgainst(token, { playerseed, dunglings, defender: FERAL_DEFENDER });
    setFehler(note);
    if (ticket) onStart(ticket);
  };
  return (
    <div className="flex flex-col gap-1.5">
      <dl className="flex flex-col gap-1 px-0.5 text-[11px]">
        <Zeile label="Kader" text={text} schwach={!regel.ok} />
        <Zeile label="Gegner" text="Feral-Hive" />
      </dl>
      {fehler ? <p className="px-0.5 text-[11px] text-bone-300">{fehler}</p> : null}
      <Knopf text="Raid starten" aktiv={regel.ok} onClick={starten} />
    </div>
  );
}

function StatusAbschnitt({ stand }) {
  const wachen = stand.wardens.filter((wache) => !wache.coma).length;
  const heimweg = approachSteps(stand.at, stand.entry);
  return (
    <dl className="flex flex-col gap-1 px-0.5 text-[11px]">
      <Zeile label="Lage" text={`${stand.phase} · Runde ${stand.round}`} />
      <Zeile label="Ausdauer" text={`${stand.stamina} von ${stand.staminaMax}`} schwach={stand.stamina === 0} />
      <Zeile label="Wächter" text={`${wachen} von ${stand.wardens.length} wach`} />
      <Zeile label="Hive" text={`${stand.hive.hp} von ${stand.hive.hpMax}`} />
      <Zeile label="Heimweg" text={heimweg === 0 ? 'am Eintritt' : `${heimweg} Schritte`} />
      <Zeile label="Beute" text={stand.carried ? `${stand.carried.essence} Essenz` : '—'} />
    </dl>
  );
}

function SchrittAbschnitt({ schritte, onStep }) {
  return (
    <div className="grid grid-cols-2 gap-1">
      {schritte.map((schritt) => (
        <div key={schritt.richtung} className="flex gap-1">
          <Knopf text={`${PFEIL[schritt.richtung]} Gehen`} aktiv={schritt.zug.legal} onClick={() => onStep(schritt.zug.type)} />
          <Knopf
            text={`${PFEIL[schritt.richtung]} Graben${Number.isFinite(schritt.hack.kosten) ? ` ${schritt.hack.kosten}` : ''}`}
            aktiv={schritt.hack.legal}
            onClick={() => onStep(schritt.hack.type)}
          />
        </div>
      ))}
    </div>
  );
}

function TatAbschnitt({ wahlen, abgerechnet, verloren, onVerb, onEnd, onSichern }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {wahlen.map((wahl) => (
          <Knopf key={wahl.type} text={TAT[wahl.type] ?? wahl.type} aktiv={wahl.legal} onClick={() => onVerb(wahl.type)} />
        ))}
      </div>
      {verloren || abgerechnet.loot ? (
        <Knopf
          text={abgerechnet.loot ? `Beute sichern: ${abgerechnet.loot.essence} Essenz, ${abgerechnet.loot.bloodstone} Blutstein` : 'Raid schließen'}
          aktiv
          onClick={onSichern}
        />
      ) : (
        <Knopf text="Abbrechen" aktiv onClick={() => onEnd(true)} />
      )}
    </div>
  );
}

function LiveAbschnitt({ raid, onStep, onVerb, onEnd, onSichern }) {
  const stand = raid.instance;
  const welt = useMemo(() => createRaidWorld({ snapshotSeed: raid.ticket.snapshotSeed }), [raid.ticket.snapshotSeed]);
  const optionen = raidOptions(stand, welt);
  const abgerechnet = settleRaid(stand);
  return (
    <div className="flex flex-col gap-2">
      <p className="px-0.5 text-[11px] leading-snug text-bone-300">{HINWEIS[stand.phase] ?? stand.phase}</p>
      <StatusAbschnitt stand={stand} />
      <SchrittAbschnitt schritte={optionen.schritte} onStep={onStep} />
      <TatAbschnitt wahlen={optionen.wahlen} abgerechnet={abgerechnet} verloren={stand.lost} onVerb={onVerb} onEnd={onEnd} onSichern={onSichern} />
    </div>
  );
}

function ErgebnisAbschnitt({ letzter, notiz }) {
  return (
    <div className="mt-2 border-t border-bone-400/10 pt-2">
      <dl className="flex flex-col gap-1 px-0.5 text-[11px]">
        <Zeile
          label="Letzter Raid"
          text={letzter.abandoned ? 'Abgebrochen' : letzter.loot ? `+${letzter.loot.essence} Essenz, +${letzter.loot.bloodstone} Blutstein` : 'Ohne Beute'}
        />
        {letzter.sacrificed.length > 0 ? <Zeile label="Geopfert" text={`${letzter.sacrificed.length} Wesen`} /> : null}
        {letzter.retrieval ? <Zeile label="Rückholung" text="Offen — der Hive fiel mit Opfer" /> : null}
        {notiz ? <Zeile label="Server" text={notiz} /> : null}
      </dl>
    </div>
  );
}

export function RaidPanel({ game, actions, playerseed, token }) {
  const [notiz, setNotiz] = useState(null);
  const verbs = useRef([]);
  const schritt = (type) => { verbs.current.push({ type }); actions.raidStep({ type }); };
  const starten = (ticket) => { verbs.current = []; setNotiz(null); actions.startRaid(ticket); };
  const sichern = async () => {
    const offen = game.raid;
    const lauf = [...verbs.current];
    actions.endRaid(false);
    if (!offen) return;
    const ergebnis = await submitRaid(token, { ticket: offen.ticket, actions: lauf, claimed: offen.instance });
    if (ergebnis.ok) setNotiz(ergebnis.gebucht ? 'Quittiert.' : `Quittung: +${ergebnis.loot?.essence ?? 0} Essenz.`);
    else setNotiz(ergebnis.error);
  };
  if (game.raid) {
    return (
      <Rahmen titel="Raid" untertitel="Feral-Hive">
        <LiveAbschnitt raid={game.raid} onStep={schritt} onVerb={schritt} onEnd={actions.endRaid} onSichern={sichern} />
      </Rahmen>
    );
  }
  return (
    <Rahmen titel="Raid" untertitel="Kader und Beute">
      <StartAbschnitt dunglings={game.dunglings} playerseed={playerseed} token={token} onStart={starten} />
      {game.lastRaid ? <ErgebnisAbschnitt letzter={game.lastRaid} notiz={notiz} /> : null}
    </Rahmen>
  );
}
