export default class Button {
    onClick:()=>void=function(){};
    image:Phaser.GameObjects.Image;
    constructor(object:Phaser.GameObjects.Image,
        hover:string
        ){
        object.setInteractive();
        const inactive=object.texture;
        object.on('pointerover', () => { object.setTexture(hover)});
        object.on('pointerout', () => { object.setTexture(inactive.key)});
        object.on('pointerup', ()=>{
            object.setTexture(hover);
            this.onClick();
        });
        this.image=object;
    }
    setOnClick(clicked:()=>void){
        this.onClick=clicked;
    }
    enable(){
        this.image.setVisible(true);
        this.image.setActive(true);
    }
    disable(){
        this.image.setVisible(false);
        this.image.setActive(false);
    }

}