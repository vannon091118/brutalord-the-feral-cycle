// @doc: docs/daten/labour/lanes.md#lanes
import { GRID_HEIGHT, GRID_WIDTH } from '../world/world-config.js';

export const LANE = Object.freeze({ A: 0, B: 1 });

export function laneOfTrip(from, to) {
  if (to.x > from.x) return LANE.A;
  if (to.x < from.x) return LANE.B;
  return to.y >= from.y ? LANE.A : LANE.B;
}

function inside(point) {
  return point.x >= 0 && point.y >= 0 && point.x < GRID_WIDTH && point.y < GRID_HEIGHT;
}

export function findPath(from, to) {
  const start = { x: Math.round(from.x), y: Math.round(from.y) };
  const goal = { x: Math.round(to.x), y: Math.round(to.y) };
  if (!inside(start) || !inside(goal)) return null;
  const path = [];
  let at = { ...start };
  while (at.x !== goal.x) {
    at = { x: at.x + Math.sign(goal.x - at.x), y: at.y };
    path.push(at);
  }
  while (at.y !== goal.y) {
    at = { x: at.x, y: at.y + Math.sign(goal.y - at.y) };
    path.push(at);
  }
  return path;
}
