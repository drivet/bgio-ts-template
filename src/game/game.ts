import { Ctx, Game, PlayerID } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

export type strOrNull = string | null;

// Return true if `cells` is in a winning configuration.
function IsVictory(cells: strOrNull[]) {
  const positions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isRowComplete = (row: number[]) => {
    const symbols = row.map((i) => cells[i]);
    return symbols.every((i) => i !== null && i === symbols[0]);
  };

  return positions.map(isRowComplete).some((i) => i === true);
}

// Return true if all `cells` are occupied.
function IsDraw(cells: strOrNull[]) {
  return cells.filter((c) => c === null).length === 0;
}

export interface TicTacToeGameState {
  cells: strOrNull[];
}

export type TicTacToeFnCtx = { G: TicTacToeGameState; ctx: Ctx };
export type TicTacToeMoveCtx = TicTacToeFnCtx & { playerID: PlayerID };

export function clickCell(fnCtx: TicTacToeMoveCtx, id: number) {
  const { G, playerID } = fnCtx;
  if (G.cells[id] !== null) {
    return INVALID_MOVE;
  }
  G.cells[id] = playerID;
}

export function endIf(fnCtx: TicTacToeFnCtx): { winner: string } | { draw: boolean } | undefined {
  const { G, ctx } = fnCtx;
  if (IsVictory(G.cells)) {
    return { winner: ctx.currentPlayer };
  }
  if (IsDraw(G.cells)) {
    return { draw: true };
  }
}

export const TicTacToe: Game<TicTacToeGameState> = {
  setup: () => ({ cells: Array<strOrNull>(9).fill(null) }),

  turn: {
    minMoves: 1,
    maxMoves: 1,
  },

  moves: {
    clickCell,
  },
  endIf,
};
