import Phaser from "phaser"
import sky from "@@/assets/sky.png"

export default class TitleScene extends Phaser.Scene {

  private key: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: "TitleScene", active: true })
  }

  preload() {
    this.load.image("sky", sky)
  }

  create() {
    this.add.image(400, 300, "sky")

    const highScore = localStorage.getItem("highScore") || "0"

    this.add.text(16, 16, `High Score: ${highScore}`, {
      fontSize: "32px",
      fill: "#000",
    })

    this.add.text(400, 200, "Phaser 3 Tutorial Game", {
      fontSize: "48px",
      fill: "#000",
    }).setOrigin(0.5)

    this.add.text(400, 400, "PRESS SPACE", {
      fontSize: "32px",
      fill: "#000",
    }).setOrigin(0.5)

    this.key = this.input.keyboard.addKey("SPACE");
  }

  update() {
    if (this.key.isDown) {
      this.scene.start("GameScene")
    }
  }
}
