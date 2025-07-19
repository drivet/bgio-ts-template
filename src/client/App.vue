<script lang="ts" setup>
import { ref } from 'vue';

import { Client } from 'boardgame.io/client';
import { SocketIO } from 'boardgame.io/multiplayer';
import { TicTacToe, TicTacToeGameState } from '../game/game';
import { State } from 'boardgame.io';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const playerID = urlParams.get('player');

const client = Client<TicTacToeGameState>({
  game: TicTacToe,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
  playerID: playerID ? playerID : undefined,
});
client.start();

let stateRef = ref(null as (State<TicTacToeGameState> | null) );
client.subscribe((state: State<TicTacToeGameState> | null) => stateRef.value = state);

function cellClick(event: MouseEvent) {
 if (!(event.target instanceof HTMLElement)) {
    return;
  }
  const id = parseInt(event.target.dataset.id || "-1");
  client.moves.clickCell(id);
}
</script>

<template>
  <table>
    <tbody>
      <tr v-for="r in 3">
        <td v-for="d in 3" class="cell" :data-id="(r - 1) * 3 + (d - 1)" @click="cellClick">
          {{ stateRef?.G.cells[(r - 1) * 3 + (d - 1)] }}
        </td>
      </tr>
    </tbody>
  </table>
  <p v-if="stateRef?.ctx.gameover?.winner" class="winner">
    Winner: {{ stateRef?.ctx.gameover.winner }}
  </p>
  <p v-else-if="stateRef?.ctx.gameover" class="winner">Draw!</p>
</template>
