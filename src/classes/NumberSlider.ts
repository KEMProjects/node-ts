import Button from "./Button";

export default class NumberSlider {
        back: Phaser.GameObjects.Image;
        text: Phaser.GameObjects.Text;
        upArrow:Button;
        downArrow:Button;
        number: integer;
	constructor(back: Phaser.GameObjects.Image, 
        text: Phaser.GameObjects.Text,
        upArrow:Button,
        downArrow:Button,min:integer,max:integer) {
                this.back=back;
                this.text=text;
                this.upArrow=upArrow;
                this.upArrow.disable();
                this.downArrow=downArrow;
                this.number=0;
                this.text.setText(this.number.toString());
                this.upArrow.setOnClick(()=>{
                        this.number--;
                        this.text.setText(this.number.toString());
                        if(this.number<=min){
                                this.upArrow.disable();
                        }
                        if(this.number<max){
                                this.downArrow.enable();
                        }
                });
                this.downArrow.setOnClick(()=>{
                        this.number++;
                        this.text.setText(this.number.toString());
                        if(this.number>=max){
                                this.downArrow.disable();
                        }
                        if(this.number>min){
                                this.upArrow.enable();
                        }
                });
	}
        getNumber(){
                return this.number;
        }
        setNumber(value:number){
                this.number=value;
                this.text.setText(this.number.toString());
        }
}