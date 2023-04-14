import { Component, OnInit } from '@angular/core';

export interface IGridPosition {
  x: number;
  y: number;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  gridSize: number = 9;
  grid: Map<string, boolean | undefined>;
  
  currentPlayer: boolean; // false for black, true for white

  constructor() {
  }
  
  ngOnInit(): void {
    this.resetBoard();
  }
  
  /**
   * Sets grid to empty start state, and current player to black.
   */
  resetBoard() {
    let startGrid = new Map();
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const gridSquare = `${i},${j}`;
        startGrid.set(gridSquare, undefined);
      }
    }
    this.grid = startGrid;
    this.currentPlayer = false;
  }

  placeStone(position: string, player: boolean) {
    if (this.grid.get(position) === undefined && !this.isCaptured(position)) {
      // place stone and swap current player
      this.grid.set(position, player);
      this.currentPlayer = !this.currentPlayer;

      // check for captures and remove
      this.grid.forEach(
        (player, position) => {
          if (player !== undefined && this.isCaptured(position)) {
            // remove stone from position
            this.grid.set(position, undefined);
          }
        }
      )
    }
  }

  isCaptured(position: string): boolean {
    const coords: IGridPosition = this.getCoords(position);

    let liberties: IGridPosition[] = [];
    if (coords.x - 1 >= 0) {
      liberties.push({x: coords.x-1, y: coords.y});
    }
    if (coords.x + 1 <= this.gridSize - 1) {
      liberties.push({x: coords.x + 1, y: coords.y});
    }
    if (coords.y - 1 >= 0) {
      liberties.push({x: coords.x, y: coords.y - 1});
    }
    if (coords.y + 1 <= this.gridSize - 1) {
      liberties.push({x: coords.x, y: coords.y + 1});
    }

    let capturedLiberties = 0;
    for (let liberty of liberties) {
      const libertyPosition = `${liberty.y},${liberty.x}`;
      if (this.grid.get(libertyPosition) === !this.grid.get(position)) {
        capturedLiberties = capturedLiberties + 1;
      }
    }

    return capturedLiberties === liberties.length;
  }


  getCoords(position: string): IGridPosition {
    const coords = position.split(',');
    return {x: Number(coords[1]), y: Number(coords[0])}; // flipped cos coordinates are annoying
  }

  vlineStyle(position: string) {
    const coords: IGridPosition = this.getCoords(position);

    let backgroundSize = '';
    let backgroundPos = '';

    if (coords.y === 0) {
      backgroundSize = '2px 50%';
      backgroundPos = 'bottom';
    } else if (coords.y === this.gridSize - 1) {
      backgroundSize = '2px 50%';
      backgroundPos = 'top';
    } else {
      backgroundSize = '2px 100%';
      backgroundPos = 'center';
    }

    return {'background-size':backgroundSize, 'background-position':backgroundPos};
  }

  hlineStyle(position: string) {
    const coords: IGridPosition = this.getCoords(position);

    let backgroundSize = '';
    let backgroundPos = '';

    if (coords.x === 0) {
      backgroundSize = '50% 2px';
      backgroundPos = 'right';
    } else if (coords.x === this.gridSize - 1) {
      backgroundSize = '50% 2px';
      backgroundPos = 'left';
    } else {
      backgroundSize = '100% 2px';
      backgroundPos = 'center';
    }
    
    return {'background-size':backgroundSize, 'background-position':backgroundPos};
  }

  isStarPoint(position: string): boolean {
    return position === '4,4' || position === '2,2' || position === '2,6' || position === '6,2' || position === '6,6'
  }

}
