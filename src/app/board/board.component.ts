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
  grid: Map<string, boolean | undefined>; // coordinate 'x,y' to player (white: true, black: false, empty: undefined) map
  
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

  /** 
   * Tries to place a stone at the given position
   */
  placeStone(position: string) {
    // can't play in occupied position
    if (this.grid.get(position) !== undefined) {
      return;
    }

    // can't self-capture
    if (this.isCaptured(position, !this.currentPlayer)) {
      console.log('position is captured, you cannot play here')
      return;
    }

    console.log('placing stone...')

    // place stone and swap current player
    this.grid.set(position, this.currentPlayer);
    this.currentPlayer = !this.currentPlayer;
    
    // check for captures and remove
    this.grid.forEach(
      (player, checkingPosition) => {
        // if there is a player in current position
        if (player !== undefined) {
          // check if player part of group
          // check if individual position captured
          if (this.isCaptured(checkingPosition, !player)) {
            // remove stone from position
            console.log('removing stone', checkingPosition)
            this.grid.set(checkingPosition, undefined);
          }
        }
      }
      )
      
  }

  /**
   * Check if piece in grid position is part of a group
   * @param position 
   */
  inGroup(position: string) {
    const coords: IGridPosition = this.getCoords(position);
  }

  /**
   * Check if a single grid position has been captured by a player
   * @param position 
   * @returns 
   */
  isCaptured(position: string, player: boolean): boolean {
    const coords: IGridPosition = this.getCoords(position);

    let liberties = this.getAdjacentIntersections(coords);

    let capturedLiberties = 0;
    for (let liberty of liberties) {
      if (this.grid.get(this.getCoordinateString(liberty)) === player) {
        capturedLiberties = capturedLiberties + 1;
      }
    }

    return capturedLiberties === liberties.length;
  }

  /**
   * Get coordinates of the adjacent intersections of a given position
   * @param coordinates IGridPosition {x: number, y: number}
   * @returns IGridPosition[] (there can be 2, 3 or 4)
   */
  getAdjacentIntersections(coordinates: IGridPosition): IGridPosition[] {
    let adjacentIntersections: IGridPosition[] = [];

    if (coordinates.x - 1 >= 0) {
      adjacentIntersections.push({x: coordinates.x-1, y: coordinates.y});
    }
    if (coordinates.x + 1 <= this.gridSize - 1) {
      adjacentIntersections.push({x: coordinates.x + 1, y: coordinates.y});
    }
    if (coordinates.y - 1 >= 0) {
      adjacentIntersections.push({x: coordinates.x, y: coordinates.y - 1});
    }
    if (coordinates.y + 1 <= this.gridSize - 1) {
      adjacentIntersections.push({x: coordinates.x, y: coordinates.y + 1});
    }

    return adjacentIntersections;
  }

  /**
   * Utility function to convert string of coordinates to object
   * @param position 'x,y'
   * @returns IGridPosition {x: number, y: number}
   */
  getCoords(position: string): IGridPosition {
    const coords = position.split(',');
    return {x: Number(coords[1]), y: Number(coords[0])}; // flipped cos coordinates are annoying
  }

  /**
   * Utility function to convert coordinate object to coordinate string
   * @param coords IGridPosition {x: number, y: number}
   * @returns 'x,y'
   */
  getCoordinateString(coords: IGridPosition): string {
    return `${coords.y},${coords.x}`;
  }

  /**
   * Get style parameters for vertical line segments depending on grid position
   * @param position 
   * @returns 
   */
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

  /**
   * Get style parameters for horizontal line segments depending on grid position
   * @param position 
   * @returns 
   */
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
