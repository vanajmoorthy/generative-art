class Particle {
  constructor(startX, startY, color) {
    this.pos = createVector(startX, startY)
    this.prevPos = this.pos.copy()
    this.color = color
  }

  update() {
    this.prevPos.set(this.pos.x, this.pos.y)

    let noiseValue = noise(this.pos.x * noiseScale, this.pos.y * noiseScale, frameCount * timeScale)

    let angle = map(noiseValue, 0, 1, 0, TWO_PI * angleMultiplier)

    let velocity = p5.Vector.fromAngle(angle)

    velocity.mult(particleSpeed)
    this.pos.add(velocity)
  }

  display() {
    let r = red(this.color)
    let g = green(this.color)
    let b = blue(this.color)

    strokeWeight(strokeW)

    stroke(r, g, b, particleAlpha)

    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y)
  }

  checkEdges() {
    if (this.pos.x > width) {
      this.pos.x = 0
      this.prevPos.x = 0
    }

    if (this.pos.x < 0) {
      this.pos.x = width
      this.prevPos.x = width
    }

    if (this.pos.y > height) {
      this.pos.y = 0
      this.prevPos.y = 0
    }

    if (this.pos.y < 0) {
      this.pos.y = height
      this.prevPos.y = height
    }
  }
}
