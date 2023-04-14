import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  gridSize: number = 9;
  grid: Map<string, boolean | undefined>;
  
  currentPlayer: boolean = false; // false for black, true for white

  constructor() {
  }
  
  ngOnInit(): void {
    this.resetBoard();
  }

  placeStone(position: string, player: boolean) {
    if (this.grid.get(position) === undefined) {
      this.grid.set(position, player);
      this.currentPlayer = !this.currentPlayer;
    }
  }

  resetBoard() {
    let startGrid = new Map();
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const gridSquare = `${i},${j}`
        startGrid.set(gridSquare, undefined);
      }
    }
    this.grid = startGrid;
    this.currentPlayer = false;
  }

  getCoords(position: string): {x: number, y: number} {
    const coords = position.split(',');
    return {x: Number(coords[0]), y: Number(coords[1])};
  }

  vlineStyle(position: string) {
    const coords = this.getCoords(position);

    let backgroundSize = '';
    let backgroundPos = '';

    if (coords.x === 0) {
      backgroundSize = '2px 50%';
      backgroundPos = 'bottom';
    } else if (coords.x === this.gridSize - 1) {
      backgroundSize = '2px 50%';
      backgroundPos = 'top';
    } else {
      backgroundSize = '2px 100%';
      backgroundPos = 'center';
    }

    return {'background-size':backgroundSize, 'background-position':backgroundPos};
  }

  hlineStyle(position: string) {
    const coords = this.getCoords(position);

    let backgroundSize = '';
    let backgroundPos = '';

    if (coords.y === 0) {
      backgroundSize = '50% 2px';
      backgroundPos = 'right';
    } else if (coords.y === this.gridSize - 1) {
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
