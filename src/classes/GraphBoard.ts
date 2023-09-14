import { Tile, TILETYPE } from "./Tile";

export class GraphBoard {
    tiles:Tile[][]=[];
    boxes:Tile[]=[];
    startPoint:Tile;
    endPoint:Tile;
    constructor(
        numX:number,
        numY:number,
        numBox:number
    ){
        this.createGrid(numX,numY);
        this.addBoxes(numBox);
        this.startPoint=this.addStartPoint();
        this.endPoint=this.addEndPoint();
    }
    checkEndPoint(x: number, y: number){
        return this.tiles[y][x].type==TILETYPE.END;
    }
    getValue(x: number, y: number) {
        return this.tiles[y][x].value;
    }
    createGrid(numX:number,numY:number){
        let index=0;
        for(let j=0;j<numY;j++){
            this.tiles[j]=[];
            for(let i=0;i<numX;i++){
                index++;
                this.tiles[j].push(new Tile(index,i,j));
            }
        }
    }
    addBoxes(numBox: number) {
        for(let i=0;i<numBox;i++){
            const tile = this.getEmptyTile();
            tile.type=TILETYPE.BOX;
            this.boxes.push(tile);
        }
    }
    addStartPoint(){
        const tile = this.getEmptyTile();
        tile.type=TILETYPE.START;
        return tile;
    }
    addEndPoint(){
        const tile = this.getEmptyTile();
        tile.type=TILETYPE.END;
        return tile;
    }
    private getEmptyTile(){
        let y =Math.floor(Math.random()*this.tiles.length);
        let x =Math.floor(Math.random()*this.tiles[y].length);
        while(this.tiles[y][x].type!=TILETYPE.EMPTY){
            y =Math.floor(Math.random()*this.tiles.length);
            x =Math.floor(Math.random()*this.tiles[y].length);
        }
        return this.tiles[y][x];
    }
    
}