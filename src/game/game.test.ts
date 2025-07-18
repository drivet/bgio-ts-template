import { Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import {
  clickCell,
  endIf,
  strOrNull,
  TicTacToeFnCtx,
  TicTacToeGameState,
  TicTacToeMoveCtx,
} from './game';

it('should return invalid', () => {
  const G = {
    cells: [null, '0', null, null, null, null, null, null, null] as strOrNull[],
  } as TicTacToeGameState;

  const moveCtx = { G, playerID: '0' } as TicTacToeMoveCtx;

  expect(clickCell(moveCtx, 1)).toBe(INVALID_MOVE);
});

it('should click a cell', () => {
  const G = {
    cells: [null, '0', null, null, null, null, null, null, null] as strOrNull[],
  } as TicTacToeGameState;

  clickCell({ G, playerID: '1' } as TicTacToeMoveCtx, 0);
  expect(G.cells[0]).toBe('1');
});

it('should not end the game', () => {
  const G = {
    cells: [null, '0', null, null, null, null, null, null, null] as strOrNull[],
  } as TicTacToeGameState;

  const ctx = {
    currentPlayer: '0',
  } as Ctx;

  expect(endIf({ G, ctx } as TicTacToeFnCtx)).toBe(undefined);
});

it('should win the game', () => {
  const G = {
    cells: ['0', '0', '0', null, null, '1', null, null, null] as strOrNull[],
  } as TicTacToeGameState;

  const ctx = {
    currentPlayer: '0',
  } as Ctx;

  expect(endIf({ G, ctx } as TicTacToeFnCtx)).toEqual({ winner: '0' });
});

it('should draw the game', () => {
  const G = {
    cells: ['0', '1', '0', '0', '0', '1', '1', '0', '1'] as strOrNull[],
  } as TicTacToeGameState;

  const ctx = {
    currentPlayer: '0',
  } as Ctx;

  expect(endIf({ G, ctx } as TicTacToeFnCtx)).toEqual({ draw: true });
});
