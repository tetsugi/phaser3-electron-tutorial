import Phaser from "phaser"
import { GameScene } from "@/renderer/scenes"

type GameConfig = Phaser.Types.Core.GameConfig

const config: GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [GameScene],
}

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config)
  }
}

window.onload = () => {
  new Game(config);
}
