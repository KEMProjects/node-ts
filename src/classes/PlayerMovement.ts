export default class PlayerMovement {
	selected:(x:number,y:number)=>void=()=>{};
	constructor(gameObject: Phaser.GameObjects.Sprite) {
		this.gameObject = gameObject;
		(gameObject as any)["__MoveOnArrowKeys"] = this;
	}

	static getComponent(gameObject: Phaser.GameObjects.Sprite): PlayerMovement {
		return (gameObject as any)["__PlayerMovement"];
	}

	public gameObject: Phaser.GameObjects.Sprite;
	public travel:number=0;
	public follower:Phaser.GameObjects.PathFollower|undefined;
	private animationKey:string="player-up";
	private followerCanMove:boolean=false;
	private followerMoving:boolean=false;
	private selectorCanMove:boolean=true;
	private minX:number=0;
	private minY:number=0;
	private maxX:number=0;
	private maxY:number=0;
	selectLeft(){
		if(!this.selectorCanMove){
			return;
		}
		this.select(this.gameObject.x-this.travel,this.gameObject.y);
	}
	selectRight(){
		if(!this.selectorCanMove){
			return;
		}
		this.select(this.gameObject.x+this.travel,this.gameObject.y);
	}
	selectUp(){
		if(!this.selectorCanMove){
			return;
		}
		this.select(this.gameObject.x,this.gameObject.y-this.travel);
	}
	selectDown(){
		if(!this.selectorCanMove){
			return;
		}
		this.select(this.gameObject.x,this.gameObject.y+this.travel);
	}
	afterSelectLeft(){
		this.afterSelect("player-left");
	}
	afterSelectRight(){
		this.afterSelect("player-right");
	}
	afterSelectUp(){
		this.afterSelect("player-up");
	}
	afterSelectDown(){
		this.afterSelect("player-down");
	}
	afterSelect(animationKey:string){
		if(this.followerCanMove){
			this.animationKey=animationKey;
			this.selected(this.gameObject.x,this.gameObject.y);
		}
	}
	move(atEnd:boolean=false){
		this.gameObject.visible=false;
		if(!this.followerCanMove){
			this.resetFollower();
			return;
		}
		this.followerMoving=true;
		this.follower?.path.lineTo(this.gameObject.x,this.gameObject.y);
		this.follower?.play(this.animationKey, true);
		this.follower?.startFollow({
			duration: 300,
			positionOnPath: true,
			repeat: 0,
			ease: 'Linear',
			delay: 40,
			loop:0,
			onComplete:()=>{
				this.stopFollower();
				if(atEnd){
					this.gameObject.scene.events.emit("last-move");
				}
				if(this.followerMoving){
					this.enableSelect();
					this.followerMoving=false;
				}
			}
		});
	}
	stopFollower(){
		this.follower?.stop();	
		this.follower?.stopFollow();
	}
	resetFollower(){
		const point=this.follower?.path.getStartPoint();
		this.gameObject.setX(point?.x);
		this.gameObject.setY(point?.y);
	}
	collided(){
		this.disableMove();
		this.stopFollower();
		this.resetFollower();
		this.enableSelect();
	}
	select(x:number,y:number){
		if(!this.selectorCanMove){
			return;
		}
		this.disableMove();
		this.gameObject.setY(y);
		this.gameObject.setX(x);
		this.follower?.path.destroy(); //calls follower onComplete()
		this.follower?.setPath(new Phaser.Curves.Path(this.follower?.x, this.follower?.y));
		//need to set bounds collision here before creating a line, because the follower will follower even
		//after stopped in the collision function
		//the physics boundaries was changing the sprite location, possibly due to body origin being different?
		if(!this.withinBounds(x,y)){
			this.collided();
			return;
		}
		this.gameObject.visible=true;
		this.disableSelect();
		this.enableMove();
	}
	setBounds(left:number,top:number,right:number,bottom:number){
		this.minX=left;
		this.minY=top;
		this.maxX=right;
		this.maxY=bottom;
	}
	withinBounds(x:number,y:number){
		if(x>=this.minX&&x<this.maxX&&y>=this.minY&&y<this.maxY){
			return true;
		}
		return false;
	}
	enableMove(){
		this.followerCanMove=true;
	}
	disableMove(){
		this.followerCanMove=false;
	}
	enableSelect(){
		this.selectorCanMove=true;
	}
	disableSelect(){
		this.selectorCanMove=false;
	}
}
