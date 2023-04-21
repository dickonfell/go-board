import { Component, OnInit } from '@angular/core';
import { GridPosition } from '../grid-position';

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

    // store groups on board at each turn
    let groups: Set<string>[] = [];
    
    // check for captures and remove
    this.grid.forEach(
      (player, checkingPosition) => {
        // if there is a player in current position
        if (player !== undefined) {
          // check if position is part of a found group
          let inGroup: boolean = false;
          groups.map(group => {
            group.forEach(pos => {
              if (pos === checkingPosition) {
                inGroup = true;
              }
            })
          });

          // if position not in a found group, find group
          if (!inGroup) {
            let initialGroup: Set<string> = new Set();
            initialGroup.add(checkingPosition);
            const group = this.getGroup(checkingPosition, initialGroup);
  
            console.log('stone at', checkingPosition, 'is in a group of', group.size);

            // check if group captured
            if (this.isGroupCaptured(group)) {
              // remove group
              console.log('group captured');
              group.forEach(groupPosition => this.grid.set(groupPosition, undefined));
            } else {
              // save group to list of groups
              groups.push(group);
            }
          }
        }
      }
    );
  }

  /**
   * Gets a group of stones from an initial input group
   * @param position 
   */
  getGroup(position: string, group: Set<string>): Set<string> {

    const coords: GridPosition = GridPosition.fromCoordinateString(position);
    const player = this.grid.get(position); // player in initial position

    // check adjacent intersections for stones of the same colour
    const adjacentIntersections = coords.getAdjacentIntersections(this.gridSize);

    for (let intersection of adjacentIntersections) {
      const intersectionString = intersection.toCoordinateString();
      // if intersection not already in group
      if (!group.has(intersectionString)) {
        // if intersection occupied by stone of same colour
        if (this.grid.get(intersectionString) === player) {
          // add intersection to group
          group.add(intersectionString);
          // add group of this intersection to group
          this.getGroup(intersectionString, group).forEach(position => {
            group.add(position);
          });
        }
      }
    }

    return group;
  }

  /**
   * Check if a group of stones has been captured
   * @param position 
   * @returns 
   */
  isGroupCaptured(group: Set<string>): boolean {
    // find liberties of group
    let liberties: Set<string> = new Set();

    // loop over positions of stones in group
    group.forEach(position => {
      const coords: GridPosition = GridPosition.fromCoordinateString(position);

      // loop over intersections adjacent to position
      const adjacentIntersections = coords.getAdjacentIntersections(this.gridSize);
      for (let intersection of adjacentIntersections) {
        const intersectionString = intersection.toCoordinateString();
        // add intersection to set of liberties if it's unoccupied
        if (this.grid.get(intersectionString) === undefined) {
          liberties.add(intersectionString);
        }
      }
    });

    // group is captured if it has no liberties
    return liberties.size === 0;
  }

  /**
   * Check if a single grid position has been captured by a player
   * @param position 
   * @returns 
   */
  isCaptured(position: string, player: boolean): boolean {
    const coords: GridPosition = GridPosition.fromCoordinateString(position);

    const liberties = coords.getAdjacentIntersections(this.gridSize);

    let capturedLiberties = 0;
    // count adjacent intersections occupied by opposite player
    for (let liberty of liberties) {
      if (this.grid.get(liberty.toCoordinateString()) === player) {
        capturedLiberties = capturedLiberties + 1;
      }
    }

    // stone is captured if all adjacent intersections occupied by opposite player
    return capturedLiberties === liberties.length;
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
    const coords: GridPosition = GridPosition.fromCoordinateString(position);

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
