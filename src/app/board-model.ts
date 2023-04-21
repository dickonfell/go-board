import { GridPosition } from "./grid-position";

export interface IGroup {
    player: boolean;
    positions: Set<string>;
    // liberties: Set<string>;
}

export class Group implements IGroup {

    player: boolean;
    positions: Set<string>;
    // liberties: Set<string>;

    constructor() {}
}


export interface IBoard {
    grid: Map<string, boolean | undefined>; // maps coordinate 'x,y' to player (white: true, black: false, none: undefined)
    groups: Group[]; // stores current groups on the board
    currentPlayer: boolean;
}

export class Board implements IBoard {

    size: number;

    grid: Map<string, boolean | undefined>;
    groups: Group[];

    currentPlayer: boolean;

    constructor(gridSize: number) {
        let startGrid = new Map();
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const gridSquare = `${i},${j}`;
                startGrid.set(gridSquare, undefined);
            }
        }
        this.size = gridSize;
        this.grid = startGrid;
        this.currentPlayer = false;
    }

    /** 
     * Tries to place a stone at the given position
     */
    placeStone(position: string) {
        // can't play in occupied position
        if (this.isOccupied(position)) {
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
                if (group.has(checkingPosition)) {
                inGroup = true;
                }
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

    isOccupied(position: string): boolean {
        return this.grid.get(position) !== undefined;
    }

    /**
     * Check if a single grid position has been captured by a player
     * @param position 
     * @returns 
     */
    isCaptured(position: string, player: boolean): boolean {
        const coords: GridPosition = GridPosition.fromCoordinateString(position);

        const liberties = coords.getAdjacentIntersections(this.size);

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
     * Gets a group of stones from an initial input group
     * @param position 
     */
    getGroup(position: string, group: Set<string>): Set<string> {

        const coords: GridPosition = GridPosition.fromCoordinateString(position);
        const player = this.grid.get(position); // player in initial position

        // check adjacent intersections for stones of the same colour
        const adjacentIntersections = coords.getAdjacentIntersections(this.size);

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
        const adjacentIntersections = coords.getAdjacentIntersections(this.size);
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
}