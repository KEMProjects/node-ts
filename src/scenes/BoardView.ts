import { GraphBoard } from "../classes/GraphBoard";
import PlayerMovement from "../classes/PlayerMovement";
import { TILETYPE } from "../classes/Tile";

export default class BoardView extends Phaser.GameObjects.Container {
    tileSize:number=64;
    player:PlayerMovement;
    lastWrongAnswer:Phaser.GameObjects.Text|undefined;
	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		const numX=10;
		const numY=10;
		const numBoxes=10;
        const width=numX*this.tileSize;
		const height=numY*this.tileSize;

        //create board
        const board = new GraphBoard(numX,numY,numBoxes);
        const colliders=this.drawTiles(board);
        this.drawGrid(width,height);
        
        const playerStart={
            x:board.startPoint.x*this.tileSize,
            y:board.startPoint.y*this.tileSize
        };
        this.player=this.drawPlayer(playerStart.x,playerStart.y,this.tileSize,colliders,board);
        this.player.setBounds(0,0,width,height);
    }
    rightAnswer(answer:number,atEnd:boolean=false){
        if(this.lastWrongAnswer){
            this.lastWrongAnswer.destroy();
            this.lastWrongAnswer=undefined;
        }
        const text = this.scene.add.text(this.player.gameObject.x,this.player.gameObject.y,answer.toString(), { 
            fontFamily: 'Verdana, "Times New Roman", Tahoma, serif', 
            fontSize: '32px', 
            color: '#000' });
        text.setOrigin(0.5,0.5);
        this.add(text);
        
        if(this.player&&this.player.follower){
            this.bringToTop(this.player.follower);
            this.player.move(atEnd);
        }
    }
    wrongAnswer(answer:number){
        if(this.lastWrongAnswer){
            this.lastWrongAnswer.destroy();
            this.lastWrongAnswer=undefined;
        }
        const text = this.scene.add.text(this.player.gameObject.x,this.player.gameObject.y,answer.toString(), { 
            fontFamily: 'Verdana, "Times New Roman", Tahoma, serif', 
            fontSize: '32px', 
            color: '#ff4500' });
        text.setOrigin(0.5,0.5);
        this.add(text);
        this.lastWrongAnswer=text;
    }
    drawPlayer(x:number,
        y:number,
        travel:number,
        colliders:Phaser.Types.Physics.Arcade.ImageWithDynamicBody[],
        board:GraphBoard){
        //cursor
        const cursor=this.scene.physics.add.sprite(x, y, "sokoban_spritesheet","environment_06.png");
        cursor.visible=true;
        this.add(cursor);

        //player character
		const playerPath = new Phaser.Curves.Path(cursor.x, cursor.y);
		const player=this.scene.add.follower(playerPath,cursor.x,cursor.y,"sokoban_spritesheet", "player_01.png");
		this.add(player);
        player.setDepth(5);
		this.scene.physics.add.existing(player);

        //movement
        const controller=new PlayerMovement(cursor);
        controller.selected=(x:number,y:number)=>{
            const boardX=x/this.tileSize;
            const boardY=y/this.tileSize;
            const value=board.getValue(boardX,boardY);
            const atEnd=board.checkEndPoint(boardX,boardY);
            //this.onMove(value,atEnd);
            this.scene.events.emit("move",value,atEnd);
        };
		controller.follower=player;
		controller.travel=travel;
        
        //add physics
        this.scene.physics.add.collider(cursor,colliders,(body)=>{
            controller.collided();
        });
        return controller;
    }
    drawTiles(board:GraphBoard){
        let colliders:Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]=[];
        board.tiles.forEach((tileRow)=>{
            tileRow.forEach((tile)=>{
                const x=tile.x*this.tileSize;
                const y=tile.y*this.tileSize;
                const tileImg = this.scene.add.image(x, y, "sokoban_spritesheet", "ground_06.png");
                this.add(tileImg);
                const text = this.scene.add.text(x,y,tile.value.toString(), { 
                    fontFamily: 'Kenney_Pixel, "Times New Roman", Tahoma, serif', 
                    fontSize: '48px', 
                    color: '#000' });
                text.setOrigin(0.5,0.5);
                this.add(text);
                this.scene.tweens.add({
                    targets: text,
                    duration: 10000,
                    ease: 'Power2',
                    alpha: -0.1,
                    onComplete:()=>{
                        text.destroy();
                    }
                });
                if(tile.type==TILETYPE.START){
                    const start = this.scene.add.image(x, y, "sokoban_spritesheet", "ground_06.png");
                    this.add(start);
                }
                if(tile.type==TILETYPE.END){
                    const end = this.scene.add.image(x, y, "sokoban_spritesheet", "ground_02.png");
                    this.add(end);
                }
                if(tile.type==TILETYPE.BOX){
                    let box = this.scene.physics.add.image(x, y, "sokoban_spritesheet", "crate_02.png");
                    box.body.moves = false;
                    box.body.allowGravity = false;
                    box.body.allowDrag = false;
                    box.body.allowRotation = false;
                    box.body.pushable = false;
                    box.body.immovable = true;
                    box.body.setSize(64, 64, false);
                    this.add(box);
                    colliders.push(box);
                }
            });
        });
        return colliders;
    }
    drawGrid(width:number,height:number){
		let graphics = this.scene.add.graphics();
		this.add(graphics);
		graphics.lineStyle(1, 0x3C3C3C, 1);

        //tiles get drawn from origin 0.5,0.5, but lines do not
        const minX=-this.tileSize/2;
        const minY=-this.tileSize/2;
		for(let i=minX;i<width;i+=this.tileSize){
			let path = new Phaser.Curves.Path(i,minY);
			path.lineTo(i,height+minY);
			path.draw(graphics);
		}
		for(let j=minY;j<height;j+=this.tileSize){
			let path = new Phaser.Curves.Path(minX,j);
			path.lineTo(width+minX,j);
			path.draw(graphics);
		}
	}

}