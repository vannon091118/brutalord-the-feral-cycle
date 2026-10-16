/** Die Nähte: Feral-Args, Panel-Verdrahtung, App-Reichweite. */
import { check, section } from './expect.mjs';
import { readFileSync } from 'node:fs';
import { feralDefender, feralTicketArgs } from '../../src/domain/raid/raid-ticket.js';
import { issueRaidTicket, submitRaid } from '../../src/ui/raid-submit.js';

function liest(pfad) {
  return readFileSync(pfad, 'utf8');
}

function checkFeralNaht() {
  section('Raid-Verdrahtung: der Feral-Gegner');
  const erster = feralDefender({ playerseed: 'a1b2c3d4' });
  check('Derselbe Seed nennt denselben Gegner', JSON.stringify(erster) === JSON.stringify(feralDefender({ playerseed: 'a1b2c3d4' })));
  check('Der Seed liegt neben dem Heimseed', erster.seed === 0xa1b2c3d4 + 1, `${erster.seed}`);
  const args = feralTicketArgs({ playerseed: 'a1b2c3d4', heroes: [] });
  check('Die Args tragen alles fürs Ticket', args.defenderSeed === erster.seed && args.defenderId === erster.id && Array.isArray(args.heroes));
}

function checkPanelNaht() {
  section('Raid-Verdrahtung: Panel und App');
  const ecke = liest('src/ui/AccountCorner.jsx');
  check('Die Ecke zeigt das Panel', ecke.includes('RaidPanel') && ecke.includes('game={game}') && ecke.includes('actions={actions}'));
  const app = liest('src/app/App.jsx');
  check('Die App reicht Spielstand und Aktionen durch', app.includes('game={state}') && app.includes('actions={actions}'));
  const panel = liest('src/ui/RaidPanel.jsx');
  check('Das Panel startet, zieht und beendet', panel.includes('actions.startRaid') && panel.includes('actions.raidStep') && panel.includes('actions.endRaid'));
  check('Das Panel fragt Optionen und Kader', panel.includes('raidOptions(') && panel.includes('cadreRule('));
}

function checkSubmitNaht() {
  section('Raid-Verdrahtung: Einreichung');
  const quelle = liest('src/ui/raid-submit.js');
  check('Der Client ruft beide Raid-Wege auf', quelle.includes("'/api/raid/ticket'") && quelle.includes("'/api/raid'"));
  return stubFetch();
}

async function stubFetch() {
  const echt = globalThis.fetch;
  const rufe = [];
  globalThis.fetch = async (url, init) => {
    rufe.push({ url, init });
    return { ok: true, status: 200, json: async () => ({ ok: true, ticket: { id: 't-1' }, loot: { essence: 3, bloodstone: 0 } }) };
  };
  try {
    const ausweis = await issueRaidTicket('tok', { defender: 'feral', heroes: ['a'] });
    check('Das Ticket kommt an', ausweis.ok === true && ausweis.ticket?.id === 't-1');
    const quittung = await submitRaid('tok', { ticket: { id: 't-1' }, actions: [], claimed: null });
    check('Die Quittung kommt an', quittung.ok === true && quittung.loot?.essence === 3);
    check('Beide Rufe tragen den Träger-Token', rufe.every((ruf) => ruf.init?.headers?.Authorization === 'Bearer tok'));
    check('Die Wege stimmen', rufe[0]?.url === '/api/raid/ticket' && rufe[1]?.url === '/api/raid');
  } finally {
    globalThis.fetch = echt;
  }
}

export async function checkRaidWiring() {
  checkFeralNaht();
  checkPanelNaht();
  await checkSubmitNaht();
}
