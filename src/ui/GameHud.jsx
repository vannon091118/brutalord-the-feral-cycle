import { hiveStock, selectPlacement } from '../state/selectors.js';
import { dunglingCapFor } from '../domain/buildings/building.js';
import { DUNGLING_COST } from '../domain/buildings/building-config.js';
import { BuildMenu } from './BuildMenu.jsx';
import { BuildingPanel } from './BuildingPanel.jsx';
import { HivePanel } from './HivePanel.jsx';
import { OnboardingHint } from './OnboardingHint.jsx';

// @doc: docs/daten/ui/gamehud.md#gamehud
function SelectedBuilding({ building, game, actions }) {
  return (
    <div className="pointer-events-auto">
      <BuildingPanel
        building={building}
        lab={game.lab}
        essence={hiveStock(game).stock}
        dunglings={game.dunglings}
        freeWorkers={game.dunglings.filter((worker) => !worker.job).length}
        onAssign={() => actions.assignWorker(building.id)}
        onRelease={() => actions.releaseWorker(building.id)}
        onOpenLab={actions.openLab}
        onBuyStone={actions.buyStone}
        onPlaceStone={actions.placeStone}
        onCreateMutant={actions.createMutant}
        onRevertMutant={actions.revertMutant}
        onClose={actions.clearBuilding}
      />
    </div>
  );
}

function BuildMenuSlot({ game, actions }) {
  return (
    <div className="pointer-events-auto">
      <BuildMenu
        essence={hiveStock(game).stock}
        usableTileCount={game.usableTileCount}
        buildings={game.buildings}
        buildChoice={game.buildChoice}
        placement={selectPlacement(game)}
        onChoose={actions.chooseBuild}
      />
    </div>
  );
}

function orderHintFor({ stock, housed, housing }) {
  if (housed >= housing) return 'Kein freier Wohnraum — ein zweiter Hort schafft fünf Plätze.';
  if (stock < DUNGLING_COST) return 'Nicht genug Essenz für einen Dungling.';
  return 'Ein Dungling schlüpft am Spawn des Hive.';
}

function HiveSlot({ game, actions, open, onClose }) {
  if (!open) return null;
  const housed = game.dunglings.length;
  const housing = dunglingCapFor(game.buildings);
  const stock = hiveStock(game).stock;
  return (
    <div className="pointer-events-auto">
      <HivePanel
        stock={stock}
        capacity={hiveStock(game).capacity}
        housed={housed}
        housing={housing}
        orderCost={DUNGLING_COST}
        canOrder={stock >= DUNGLING_COST && housed < housing}
        orderHint={orderHintFor({ stock, housed, housing })}
        dunglings={game.dunglings}
        onOrder={actions.orderDungling}
        onClose={onClose}
      />
    </div>
  );
}

export function GameHud({ game, actions, hiveOpen = false, onCloseHive = null }) {
  const selected = game.buildings.find((building) => building.id === game.selectedBuildingId) ?? null;

  return (
    <div className="pointer-events-none relative z-10 flex w-full flex-col items-center gap-2 px-3 pb-3">
      {selected ? <SelectedBuilding building={selected} game={game} actions={actions} /> : null}
      <HiveSlot game={game} actions={actions} open={hiveOpen} onClose={onCloseHive} />
      {game.buildMenuVisible ? <BuildMenuSlot game={game} actions={actions} /> : null}
      <div className="pointer-events-auto">
        <OnboardingHint
          onboarding={game.onboarding}
          usableTileCount={game.usableTileCount}
          essence={hiveStock(game).stock}
          depth={game.world.depth}
          cycle={game.economy}
          buildings={game.buildings}
          onDescend={actions.descend}
        />
      </div>
    </div>
  );
}
