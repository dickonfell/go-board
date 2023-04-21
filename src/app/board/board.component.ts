import { Component, OnInit } from '@angular/core';
import { GridPosition } from '../grid-position';
import { Board } from '../board-model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  gridSize: number = 9;
  board: Board;

  constructor() {
  }
  
  ngOnInit(): void {
    this.resetBoard();
  }
  
  /**
   * Sets grid to empty start state, and current player to black.
   */
  resetBoard() {
    this.board = new Board(this.gridSize);
  }

  /** 
   * Tries to place a stone at the given position
   */
  placeStone(position: string) {
    this.board.placeStone(position);
  }

  /**
   * Get style parameters for vertical line segments depending on grid position
   * @param position 
   * @returns 
   */
  vlineStyle(position: string) {
    const coords: GridPosition = GridPosition.fromCoordinateString(position);

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

  /**
   * Get style parameters for horizontal line segments depending on grid position
   * @param position 
   * @returns 
   */
  hlineStyle(position: string) {
    const coords: GridPosition = GridPosition.fromCoordinateString(position);

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
