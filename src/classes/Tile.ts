export class Tile{
    value:number;
    x:number;
    y:number;
    type:TILETYPE;
    constructor(
        value:number,
        x:number,
        y:number
    ){
        this.value=value;
        this.y=y;
        this.x=x;
        this.type=TILETYPE.EMPTY;
    }
}

export enum TILETYPE{
        EMPTY,
        BOX,
        COIN,
        START,
        END
    }
