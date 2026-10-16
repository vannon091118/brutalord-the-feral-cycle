import { memo, useMemo } from 'react';
import { DunglingSvg } from './Dungling.svg.jsx';
import { MutantSvg } from './dungling/MutantSvg.jsx';
import { MiningParticles } from './MiningParticles.jsx';
import { CarriedEssence, EssencePopup } from './essence/EssencePopup.jsx';
import { genomeOf, isMutant } from '../domain/brutelord/mutant.js';

function WorkerBody({ worker, tileSize }) {
  const { dungling, position, step } = worker;
  const mutant = isMutant(dungling);
  const genome = useMemo(() => (mutant ? genomeOf(dungling) : null), [mutant, dungling]);
  if (!mutant) {
    return <DunglingSvg dungling={dungling} tileSize={tileSize} x={position.x} y={position.y} step={step} />;
  }
  const facing = dungling.facing >= 0 ? 1 : -1;
  return (
    <g transform={`translate(${position.x} ${position.y}) scale(${facing} 1)`}>
      <MutantSvg genome={genome} size={tileSize * 0.9} id={worker.id} state={dungling.state} />
    </g>
  );
}

function PathPreview({ workers, tileSize }) {
  const previews = workers.filter((worker) => (worker.dungling.job?.previewMs ?? 0) > 0);
  return (
    <g style={{ pointerEvents: 'none' }}>
      {previews.map((worker) => {
        const points = (worker.dungling.job.path ?? [])
          .map((point) => `${(point.x + 0.5) * tileSize},${(point.y + 0.5) * tileSize}`)
          .join(' ');
        if (!points) return null;
        const last = worker.dungling.job.path.at(-1);
        return (
          <g key={`weg-${worker.id}`}>
            <polyline points={points} fill="none" stroke="rgba(74,222,128,0.55)" strokeWidth={tileSize * 0.08} strokeLinecap="round" />
            <circle cx={(last.x + 0.5) * tileSize} cy={(last.y + 0.5) * tileSize} r={tileSize * 0.12} fill="rgba(74,222,128,0.55)" />
          </g>
        );
      })}
    </g>
  );
}

// @doc: docs/daten/world/workerlayer.md#workerlayer
export const WorkerLayer = memo(function WorkerLayer({ workers, popups, tileSize }) {
  return (
    <>
      <PathPreview workers={workers} tileSize={tileSize} />
      {workers.map((worker) => (
        <g key={worker.id}>
          <WorkerBody worker={worker} tileSize={tileSize} />
          <MiningParticles origin={worker.position} tick={worker.step} active={worker.mining} />
          {worker.dungling.job?.carrying ? (
            <CarriedEssence position={worker.position} tileSize={tileSize} />
          ) : null}
        </g>
      ))}
      {popups.map((popup) => (
        <EssencePopup key={popup.id} at={popup.position} />
      ))}
    </>
  );
});
