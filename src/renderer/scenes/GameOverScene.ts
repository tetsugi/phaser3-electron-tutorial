import Phaser from "phaser"

export default class GameOverScene extends Phaser.Scene {

  private key: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: "GameOverScene", active: false })
  }

  preload() {}

  create({ score }: { score: number }) {
    const highScore = +localStorage.getItem("highScore")

    this.add.text(400, 200, "GAME OVER", {
      fontSize: "64px",
      fill: "#fff",
    }).setOrigin(0.5)

    if (highScore < score) {
      localStorage.setItem("highScore", score + "")

      this.add.text(400, 300, `High Score!! ${score}`, {
        fontSize: "32px",
        fill: "#ff0",
      }).setOrigin(0.5)
    }

    this.add.text(400, 400, "PRESS SPACE TO RETRY", {
      fontSize: "32px",
      fill: "#fff",
    }).setOrigin(0.5)

    this.key = this.input.keyboard.addKey("SPACE");
  }

  update() {
    if (this.key.isDown) {
      this.scene.start("GameScene")
    }
  }
}
