/** Die Gruppe der Gruppen-Prüfungen: Bewegung, Traits, Format, Optionen, Ablauf. */
import { checkRaidMove } from './check-raid-move.mjs';
import { checkRaidTraits } from './check-raid-traits.mjs';
import { checkRaidFormat } from './check-raid-format.mjs';
import { checkRaidOptions } from './check-raid-options.mjs';
import { checkRaidFlow } from './check-raid-flow.mjs';
import { checkRaidSettle } from './check-raid-settle.mjs';

export function checkRaidGroup() {
  checkRaidMove();
  checkRaidTraits();
  checkRaidFormat();
  checkRaidOptions();
  checkRaidFlow();
  checkRaidSettle();
}