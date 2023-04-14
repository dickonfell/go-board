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

}
