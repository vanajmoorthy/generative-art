class Particle {
  // Constructor now only needs starting position and color
  constructor(startX, startY, color) {
    this.pos = createVector(startX, startY)
    this.prevPos = this.pos.copy()
    this.color = color // Store the assigned color
    // No need to store noiseScale, angleMultiplier, particleSpeed, timeScale
  }

  update() {
    this.prevPos.set(this.pos.x, this.pos.y)

    // --- Use GLOBAL variables controlled by sliders ---
    let noiseValue = noise(
      this.pos.x * noiseScale, // Use global noiseScale
      this.pos.y * noiseScale, // Use global noiseScale
      frameCount * timeScale, // Use global timeScale
    )
    let angle = map(noiseValue, 0, 1, 0, TWO_PI * angleMultiplier) // Use global angleMultiplier

    let velocity = p5.Vector.fromAngle(angle)
    velocity.mult(particleSpeed) // Use global particleSpeed
    this.pos.add(velocity)
  }

  display() {
    let r = red(this.color)
    let g = green(this.color)
    let b = blue(this.color)

    // --- Use GLOBAL particleAlpha controlled by slider ---
    strokeWeight(strokeW)

    stroke(r, g, b, particleAlpha) // Use global particleAlpha
    line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y)
  }

  checkEdges() {
    // Wrap around logic remains the same
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
