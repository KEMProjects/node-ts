import Phaser from 'phaser';

export default class Preload extends Phaser.Scene {
  constructor() {
    super('Preload');
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.pack("asset-pack", "assets/asset-pack.json");
    this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Level"));
  }

  create() {
    const logo = this.add.image(400, 70, 'logo');

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }
}
