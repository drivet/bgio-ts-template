import { Client } from 'boardgame.io/client';
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { TicTacToe, TicTacToeGameState } from './game/game';
import { PlayerID, State } from 'boardgame.io';

interface TicTacToeClientProps {
  playerID: PlayerID | null;
}

class TicTacToeClient {
  private client: ReturnType<typeof Client<TicTacToeGameState>>;
  private rootElement: HTMLElement;

  constructor(rootElement: HTMLElement, { playerID }: TicTacToeClientProps) {
    this.client = Client<TicTacToeGameState>({
      game: TicTacToe,
      //multiplayer: Local(),
      multiplayer: SocketIO({ server: 'localhost:8000' }),
      playerID: playerID ? playerID : undefined,
    });
    this.client.start();
    this.rootElement = rootElement; 
    this.createBoard();
    this.attachListeners();
    this.client.subscribe((state: State<TicTacToeGameState> | null) => this.update(state));
  }

  update(state: State<TicTacToeGameState> | null): void { 
    if (state === null) {
      return;
    }
     // Get all the board cells.
    const cells: NodeListOf<HTMLElement>  = this.rootElement.querySelectorAll('.cell');
    // Update cells to display the values in game state.
    cells.forEach(cell => {
      const cellId = parseInt(cell.dataset.id || "-1");
      const cellValue = state.G.cells[cellId];
      cell.textContent = cellValue !== null ? cellValue : '';
    });
    // Get the gameover message element.
    const messageEl = this.rootElement.querySelector('.winner');
    if (!messageEl) {
      return;
    }
    // Update the element to show a winner if any.
    if (state.ctx.gameover) {
      messageEl.textContent =
        state.ctx.gameover.winner !== undefined
          ? 'Winner: ' + state.ctx.gameover.winner
          : 'Draw!';
    } else {
      messageEl.textContent = '';
    }
  }

  private createBoard() {
    // Create cells in rows for the Tic-Tac-Toe board.
    const rows = [];
    for (let i = 0; i < 3; i++) {
      const cells = [];
      for (let j = 0; j < 3; j++) {
        const id = 3 * i + j;
        cells.push(`<td class="cell" data-id="${id}"></td>`); 
      }
      rows.push(`<tr>${cells.join('')}</tr>`);
    }

    // Add the HTML to our app <div>.
    // We’ll use the empty <p> to display the game winner later.
    this.rootElement.innerHTML = `
      <table>${rows.join('')}</table>
      <p class="winner"></p>
    `;
  }

  private attachListeners() {
    // This event handler will read the cell id from a cell’s
    // `data-id` attribute and make the `clickCell` move.
    const handleCellClick = (event: MouseEvent) => {
      if (!(event.target instanceof HTMLElement)) {
        return;
      }
      const id = parseInt(event.target.dataset.id || "-1");
      this.client.moves.clickCell(id);
    };
    // Attach the event listener to each of the board cells.
    const cells: NodeListOf<HTMLElement> = this.rootElement.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.onclick = handleCellClick;
    });
  }
}

const appElement = document.getElementById('app') as HTMLElement;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const playerID = urlParams.get('player');
const app = new TicTacToeClient(appElement, { playerID } );
