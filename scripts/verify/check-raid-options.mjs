/** Jeder angebotene Knopf bewegt den Zustand, und die Ferne schlägt nicht. */
import { check, section } from './expect.mjs';
import { raidOptions } from '../../src/domain/raid/raid-options.js';
import { applyAction } from '../../src/domain/raid/raid-steps.js';
import { createRaidWorld } from '../../src/domain/raid/raid-world.js';
import { RAID_ACTION } from '../../src/domain/raid/raid-actions.js';
import { raidState, raidWorld } from './raid-fixture.mjs';

function checkEhrlicheKnoepfe() {
  section('Raid-Optionen: legal heißt wirksam');
  const stand = raidState();
  const welt = raidWorld();
  const optionen = raidOptions(stand, welt);
  const alle = [...optionen.schritte.flatMap((schritt) => [schritt.zug, schritt.hack]), ...optionen.wahlen];
  check('Der Einmarsch bietet Schritte an', alle.some((option) => option.legal));
  check('Jede legale Option bewegt den Zustand', alle.filter((option) => option.legal).every((option) => applyAction(stand, welt, { type: option.type }) !== stand));
  check('Unerreichbares ist nicht angeboten', alle.some((option) => !option.legal));
  check('Grabkosten starten oberhalb null', optionen.schritte.every((schritt) => schritt.hack.kosten > 0));
}

function checkReichweite() {
  section('Raid-Optionen: Schläge brauchen Reichweite');
  const stand = raidState();
  const welt = createRaidWorld({ snapshotSeed: 4242 });
  const fern = applyAction(stand, welt, { type: RAID_ACTION.ATTACK });
  check('Angriff aus der Ferne bewegt nichts', fern === stand);
  const nah = { ...stand, at: { ...stand.wardens[0].at } };
  check('Angriff in Reichweite trifft', applyAction(nah, welt, { type: RAID_ACTION.ATTACK }) !== nah);
  const angriff = raidOptions(stand, welt).wahlen.find((wahl) => wahl.type === RAID_ACTION.ATTACK);
  check('Die Ferne bietet keinen Angriff an', angriff.legal === false);
}

export function checkRaidOptions() {
  checkEhrlicheKnoepfe();
  checkReichweite();
}
