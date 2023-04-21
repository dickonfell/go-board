
export interface IGridPosition {
    x: number;
    y: number;
}

  
export class GridPosition implements IGridPosition {
    
    x: number;
    y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
       * Convert GridPosition to coordinate string
       * @returns 'x,y'
       */
    public toCoordinateString(): string {
        return `${this.x},${this.y}`;
    }

    public static fromCoordinateString(position: string): GridPosition {
        const coords = position.split(',');
        return new GridPosition(
            Number(coords[0]),
            Number(coords[1]), 
        )
    }

    /**
     * Get coordinates of the adjacent intersections of this GridPosition
     * @param gridSize Max dimension of grid
     * @returns an array of GridPositions (there can be 2, 3 or 4)
     */
    public getAdjacentIntersections(gridSize: number): GridPosition[] {
        let adjacentIntersections: GridPosition[] = [];

        if (this.x - 1 >= 0) {
            adjacentIntersections.push(
                new GridPosition(this.x - 1, this.y)
            );
        }
        if (this.x + 1 <= gridSize - 1) {
            adjacentIntersections.push(
                new GridPosition(this.x + 1, this.y)
            );
        }
        if (this.y - 1 >= 0) {
            adjacentIntersections.push(
                new GridPosition(this.x, this.y - 1)
            );
        }
        if (this.y + 1 <= gridSize - 1) {
            adjacentIntersections.push(
                new GridPosition(this.x, this.y + 1)
            );
        }

        return adjacentIntersections;
    }
}
