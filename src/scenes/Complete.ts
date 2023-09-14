import Button from "../classes/Button";

export default class Complete extends Phaser.Scene {

	constructor() {
		super("Complete");
	}

	create() {
		const text = this.add.text(this.game.canvas.width/2,this.game.canvas.height/2-100,"Play again?", { 
            fontFamily: 'Kenney_Blocks, "Times New Roman", Tahoma, serif', 
            fontSize: '64px', 
            color: '#000' });
		text.setOrigin(0.5,0.5);
		const submit=this.add.image(this.game.canvas.width/2, this.game.canvas.height/2,"playAgainBtn");
		const submitBtn=new Button(submit,"playAgainBtnHover");
		submitBtn.setOnClick(()=>{
			this.scene.start("Level");
		});
		this.events.emit("scene-awake");
	}

}