

export interface IGroup {
    player: boolean;
    positions: Set<string>;
    liberties: Set<string>;
}

export class Group implements IGroup {

    player: boolean;
    positions: Set<string>;
    liberties: Set<string>;

    constructor() {}
}