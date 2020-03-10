import Phaser from "phaser"
import sky from "@@/assets/sky.png"
import ground from "@@/assets/platform.png"
import star from "@@/assets/star.png"
import bomb from "@@/assets/bomb.png"
import dude from "@@/assets/dude.png"

const images = [
  ["sky", sky],
  ["ground", ground],
  ["star", star],
  ["bomb", bomb],
]

type Sprite = Phaser.Physics.Arcade.Sprite

export default class GameScene extends Phaser.Scene {

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys

  private score = 0
  private scoreText: Phaser.GameObjects.Text
  private gameOver = false

  private player: Sprite

  constructor() {
    super({ key: "SampleScene" })
  }

  preload() {
    images.forEach(([k, v]) => this.load.image(k, v))

    this.load.spritesheet("dude", dude, { frameWidth: 32, frameHeight: 48 })
  }

  create() {
    this.add.image(400, 300, "sky")

    const platforms = this.physics.add.staticGroup()

    platforms.create(400, 568, "ground").setScale(2).refreshBody()

    platforms.create(600, 400, "ground")
    platforms.create(50, 250, "ground")
    platforms.create(750, 220, "ground")

    this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: "32px", fill: "#000" })

    this.cursors = this.input.keyboard.createCursorKeys()
    this.player = this.physics.add.sprite(100, 450, "dude")

    const { player } = this
    player.setBounce(0.2)
    player.setCollideWorldBounds(true)

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    })

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    })

    this.physics.add.collider(this.player, platforms)

    const stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    })

    stars.children.iterate((child: Sprite) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })

    const bombs = this.physics.add.group()
    this.physics.add.collider(bombs, platforms)
    this.physics.add.collider(player, bombs, (player: Sprite) => {
      this.physics.pause()

      player.setTint(0xff0000)
      player.anims.play("turn")

      this.gameOver = true
    })

    this.physics.add.collider(stars, platforms)
    this.physics.add.overlap(player, stars, (_, star: Sprite) => {
      star.disableBody(true, true)
      this.score += 10
      this.scoreText.setText(`Score: ${this.score}`)

      if (stars.countActive(true) !== 0) return

      stars.children.iterate((child: Sprite) => {
        child.enableBody(true, child.x, 0, true, true)
      })

      const x = player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400)

      const bomb: Sprite = bombs.create(x, 16, "bomb")
      bomb.setBounce(1)
      bomb.setCollideWorldBounds(true)
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    }, null, this)
  }

  update() {
    const { cursors, player, gameOver } = this

    if (gameOver) return

    if (cursors.left.isDown) {
      player.setVelocityX(-160)
      player.anims.play("left", true)
    }
    else if (cursors.right.isDown) {
      player.setVelocityX(160)
      player.anims.play("right", true)
    }
    else {
      player.setVelocityX(0)
      player.anims.play("turn")
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330)
    }
  }
}
