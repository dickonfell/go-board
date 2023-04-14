import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  gridSize: number = 9;
  grid: number[];

  constructor() {
  }
  
  ngOnInit(): void {
    this.grid = Array(this.gridSize ** 2)
  }

  placeStone() {
    console.log('clicked square');
  }

}
