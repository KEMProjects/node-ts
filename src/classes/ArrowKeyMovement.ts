import Button from "./Button";
import PlayerMovement from "./PlayerMovement";

export class ArrowKeyMovement extends Phaser.GameObjects.Container {
    upBtn:Button;
    downBtn:Button;
    leftBtn:Button;
    rightBtn:Button;
	constructor(scene: Phaser.Scene, x?: number, y?: number) {
        super(scene, x ?? 0, y ?? 0);
        const pad=50;
        x=x??0;
        y=y??0;
        const up = this.scene.add.image(x,y-pad,"moveUpBtnDefault");
        const down = this.scene.add.image(x,y+pad,"moveDownBtnDefault");
        const left = this.scene.add.image(x-pad,y,"moveLeftBtnDefault");
        const right = this.scene.add.image(x+pad,y,"moveRightBtnDefault");
        this.upBtn = new Button(up,"moveUpBtnHover");
        this.downBtn = new Button(down,"moveDownBtnHover");
        this.leftBtn = new Button(left,"moveLeftBtnHover");
        this.rightBtn = new Button(right,"moveRightBtnHover");
        this.add(up);
        this.add(down);
        this.add(left);
        this.add(right);
    }
    
    setPlayer(player:PlayerMovement){
        const arrowKeys=this.scene.input.keyboard.createCursorKeys();
		arrowKeys.down.on("down",()=>{
			player.selectDown();
		});
		arrowKeys.down.on("up",()=>{
			player.afterSelectDown();
		});
        this.downBtn.setOnClick(()=>{
            player.selectDown();
            player.afterSelectDown();
        });
		arrowKeys.up.on("down",()=>{
			player.selectUp();
		});
		arrowKeys.up.on("up",()=>{
			player.afterSelectUp();
		});
        this.upBtn.setOnClick(()=>{
            player.selectUp();
            player.afterSelectUp();
        });
		arrowKeys.left.on("down",()=>{
			player.selectLeft();
		});
		arrowKeys.left.on("up",()=>{
			player.afterSelectLeft();
		});
        this.leftBtn.setOnClick(()=>{
            player.selectLeft();
            player.afterSelectLeft();
        });
		arrowKeys.right.on("down",()=>{
			player.selectRight();
		});
		arrowKeys.right.on("up",()=>{
			player.afterSelectRight();
		});
        this.rightBtn.setOnClick(()=>{
            player.selectRight();
            player.afterSelectRight();
        });
    }
}