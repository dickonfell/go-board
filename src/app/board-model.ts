import { GridPosition } from "./grid-position";


export interface IGroup {
    player: boolean;
    positions: Set<string>;
    liberties: Set<string>;
}

export class Group implements IGroup {

    player: boolean;
    positions: Set<string>;
    liberties: Set<string>;

    constructor(player: boolean, positions: Set<string>, liberties: Set<string>) {
        this.player = player;
        this.positions = positions;
        this.liberties = liberties;
    }

    contains(position: string): boolean {
        if (this.positions.has(position)) {
            return true;
        }
        return false;
    }
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
        this.groups = [];
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

        // place stone
        this.grid.set(position, this.currentPlayer);

        // re-calculate groups
        this.calculateGroups(position);

        // swap current player
        this.currentPlayer = !this.currentPlayer;

        // remove groups with no liberties
        let index = 0;
        this.groups.forEach(group => {
            if (group.liberties.size === 0) {
                this.removeGroup(group);
                this.groups.splice(index,1);
            }
            index = index + 1;
        });

        console.log(this.groups);
    }

    calculateGroups(position: string) {
        // find group for stone in given position (add to existing or make new one)
        let groupFound: boolean = false;

        this.groups.forEach(group => {
            //  - if position in liberty of an existing group, add to group
            if (group.liberties.has(position) && group.player === this.currentPlayer) {
                console.log('adding to existing group')
                group.positions.add(position);
                group.liberties = this.groupLiberties(group.positions);

                groupFound = true;
            }
        });

        this.groups.forEach(group => {
            group.liberties = this.groupLiberties(group.positions);
        })

        if (!groupFound) {
            console.log('making new group')
            //  - else make singleton group
            const positions: Set<string> = new Set();
            positions.add(position);
            this.groups.push(new Group(this.currentPlayer, positions, this.groupLiberties(positions)));
        }
    }

    removeGroup(group: Group) {
        group.positions.forEach(position => {
            this.grid.set(position, undefined);
        });
    }

    inGroup(position: string): boolean {
        let inGroup: boolean = false;
        this.groups.map(group => {
            if (group.contains(position)) {
                inGroup = true;
            }
        });
        return inGroup;
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
     * Find liberties of a group
     * @param group 
     * @returns 
     */
    groupLiberties(positions: Set<string>): Set<string> {
        let liberties: Set<string> = new Set();

        // loop over positions of stones in group
        positions.forEach(position => {
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
        return liberties;
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