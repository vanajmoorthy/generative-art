let particles = []

let noiseScale
let angleMultiplier
let particleSpeed
let timeScale
let particleAlpha
let numParticles

let allPalettes = []
let currentPaletteIndex = 0
let currentPaletteName = ''

let nsSlider, amSlider, psSlider, tsSlider, paSlider, npSlider, swSlider
let nsValueSpan, amValueSpan, psValueSpan, tsValueSpan, paValueSpan, npValueSpan, swValueSpan

let canvas

let isPaused = false

let paletteLabelDiv

function setup() {
  let canvasWidth = 360
  let canvasHeight = 450
  canvas = createCanvas(canvasWidth, canvasHeight)
  canvas.parent('canvas-container')

  paletteLabelDiv = createDiv('').id('palette-label')
  paletteLabelDiv.parent(document.getElementById('palette-label-container'))

  createControls()

  updateParametersFromSliders()

  definePalettes()
  createParticles()
  background(255)

  npSlider.input(handleNumParticlesChange)
}

function setPaletteName(name) {
  if (paletteLabelDiv) {
    paletteLabelDiv.html(`🎨 ${name}`)
  }
}

function draw() {
  if (isPaused) {
    return
  }

  updateParametersFromSliders()

  for (let p of particles) {
    p.update()
    p.display()
    p.checkEdges()
  }

  fill(255)
  noStroke()
}

function createControls() {
  let controlsDiv = select('#controls-container')

  nsSlider = createSlider(0.0001, 0.01, 0.001, 0.0001)
  nsValueSpan = createSpan('0.001')
  createControlRow(controlsDiv, 'Noise Scale:', nsSlider, nsValueSpan)

  amSlider = createSlider(0, 10, 3, 0.1)
  amValueSpan = createSpan('3.0')
  createControlRow(controlsDiv, 'Angle Multiplier:', amSlider, amValueSpan)

  psSlider = createSlider(0.1, 5, 1, 0.1)
  psValueSpan = createSpan('1.0')
  createControlRow(controlsDiv, 'Speed:', psSlider, psValueSpan)

  tsSlider = createSlider(0, 0.02, 0.005, 0.0001)
  tsValueSpan = createSpan('0.0050')
  createControlRow(controlsDiv, 'Time Scale:', tsSlider, tsValueSpan)

  paSlider = createSlider(1, 255, 55, 1)
  paValueSpan = createSpan('55')
  createControlRow(controlsDiv, 'Alpha:', paSlider, paValueSpan)

  swSlider = createSlider(0.5, 20, 10, 0.1)
  swValueSpan = createSpan('10.0')
  createControlRow(controlsDiv, 'Stroke Weight:', swSlider, swValueSpan)

  npSlider = createSlider(10, 2000, 1200, 10)
  npValueSpan = createSpan('1000')
  createControlRow(controlsDiv, 'Particles:', npSlider, npValueSpan)

  // 🎛 Toolbar container
  let buttonBar = createDiv()
  buttonBar.parent(controlsDiv)
  buttonBar.style('display', 'flex')
  buttonBar.style('gap', '10px')
  buttonBar.style('margin-top', '15px')
  buttonBar.style('justify-content', 'center')

  // ⏯ Pause/Play button (icon only)

  const pauseSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`

  const playSVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg"><polygon points="5,3 19,12 5,21"/></svg>`

  let pausePlayButton = createButton(pauseSVG)

  pausePlayButton.mousePressed(() => {
    isPaused = !isPaused
    pausePlayButton.html(isPaused ? playSVG : pauseSVG)
  })

  pausePlayButton.parent(buttonBar)

  // 🎲 Randomize button (label visible)
  let randomizeButton = createButton('🎲 Randomize')
  randomizeButton.mousePressed(randomizeSliders)
  randomizeButton.parent(buttonBar)
  randomizeButton.addClass('randomize-button')

  // 📷 Save button (icon only)
  let saveButton = createButton('📷')
  saveButton.mousePressed(() => saveCanvas('particle-art', 'png'))
  saveButton.parent(buttonBar)
}

function randomizeSliders() {
  nsSlider.value(random(0.0001, 0.01))
  amSlider.value(random(0, 10))
  psSlider.value(random(0.1, 5))
  tsSlider.value(random(0, 0.02))
  paSlider.value(int(random(1, 256)))
  swSlider.value(random(0.5, 20))
  npSlider.value(int(random(100, 5001)))

  updateParametersFromSliders()
  handleNumParticlesChange()
  background(255)
}

function createControlRow(parentDiv, labelText, slider, valueSpan) {
  let row = createDiv()
  row.addClass('control-row')

  let label = createSpan(labelText)
  label.class('label-span')
  label.parent(row)

  slider.parent(row)

  valueSpan.class('value-span')
  valueSpan.parent(row)

  row.parent(parentDiv)
}

function updateParametersFromSliders() {
  noiseScale = nsSlider.value()
  nsValueSpan.html(noiseScale.toFixed(4))

  angleMultiplier = amSlider.value()
  amValueSpan.html(angleMultiplier.toFixed(1))

  particleSpeed = psSlider.value()
  psValueSpan.html(particleSpeed.toFixed(1))

  timeScale = tsSlider.value()
  tsValueSpan.html(timeScale.toFixed(4))

  particleAlpha = paSlider.value()
  paValueSpan.html(particleAlpha)

  strokeW = swSlider.value()
  swValueSpan.html(strokeW.toFixed(1))

  numParticles = npSlider.value()
  npValueSpan.html(numParticles)
}

function handleNumParticlesChange() {
  if (particles.length !== numParticles) {
    console.log('Recreating particles:', numParticles)
    createParticles()

    background(255)
  }
}

function createParticles() {
  particles = []
  if (!allPalettes[currentPaletteIndex]) return
  let activePalette = allPalettes[currentPaletteIndex].colors

  for (let i = 0; i < numParticles; i++) {
    let startX = random(width)
    let startY = random(height)
    let chosenColor = random(activePalette)

    particles.push(new Particle(startX, startY, chosenColor))
  }
}

function switchPalette() {
  let focused = document.activeElement

  if (focused && focused.type === 'range') {
    console.log('Slider focused, ignoring palette switch.')
    return
  }

  currentPaletteIndex++

  if (currentPaletteIndex >= allPalettes.length) {
    currentPaletteIndex = 0
  }

  currentPaletteName = allPalettes[currentPaletteIndex].name
  setPaletteName(currentPaletteName)

  background(255)

  createParticles()

  isPaused = false
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    switchPalette() // Call the shared switching function
  }
}

function keyPressed() {
  if (key === ' ' || keyCode === 32) {
    switchPalette()
  }
}

function definePalettes() {
  allPalettes.push({
    name: 'Electric Sunset',
    colors: [
      color(255, 95, 109),
      color(255, 195, 113),
      color(164, 78, 230),
      color(85, 18, 230),
      color(255, 140, 150),
    ],
  })
  // Palette 1: Neon Future
  allPalettes.push({
    name: 'Neon Future',
    colors: [
      color(57, 255, 20),
      color(255, 0, 110),
      color(0, 217, 255),
      color(255, 240, 0),
      color(132, 0, 255),
    ],
  })
  // Palette 2: Tropical Punch
  allPalettes.push({
    name: 'Tropical Punch',
    colors: [
      color(255, 65, 87),
      color(0, 200, 150),
      color(255, 160, 0),
      color(75, 0, 130),
      color(190, 255, 0),
    ],
  })
  // Palette 3: Ocean Depth
  allPalettes.push({
    name: 'Ocean Depth',
    colors: [
      color(0, 50, 150),
      color(0, 120, 200),
      color(100, 200, 255),
      color(255, 100, 150),
      color(50, 180, 160),
    ],
  })
  // Palette 4: Retro Pop
  allPalettes.push({
    name: 'Retro Pop',
    colors: [
      color(255, 105, 180),
      color(255, 215, 0),
      color(0, 191, 255),
      color(255, 69, 0),
      color(50, 205, 50),
    ],
  })
  // Palette 5: Vivid Contrast
  allPalettes.push({
    name: 'Vivid Contrast',
    colors: [
      color(255, 0, 0),
      color(0, 255, 0),
      color(0, 0, 255),
      color(255, 255, 0),
      color(255, 0, 255),
    ],
  })
  // Palette 6: Soft Glow
  allPalettes.push({
    name: 'Soft Glow',
    colors: [
      color(255, 182, 193),
      color(173, 216, 230),
      color(240, 230, 140),
      color(144, 238, 144),
      color(221, 160, 221),
    ],
  })

  // Palette 7: Forest Canopy
  allPalettes.push({
    name: 'Forest Canopy',
    colors: [
      color(34, 139, 34),
      color(0, 100, 0),
      color(139, 69, 19),
      color(85, 107, 47),
      color(173, 255, 47),
    ],
  })
  // Palette 8: Desert Mirage
  allPalettes.push({
    name: 'Desert Mirage',
    colors: [
      color(244, 164, 96),
      color(210, 105, 30),
      color(178, 34, 34),
      color(255, 228, 181),
      color(139, 0, 0),
    ],
  })
  // Palette 9: Arctic Chill
  allPalettes.push({
    name: 'Arctic Chill',
    colors: [
      color(240, 248, 255),
      color(176, 224, 230),
      color(70, 130, 180),
      color(100, 149, 237),
      color(224, 255, 255),
    ],
  })
  // Palette 10: Volcanic Ash
  allPalettes.push({
    name: 'Volcanic Ash',
    colors: [
      color(47, 79, 79),
      color(105, 105, 105),
      color(112, 128, 144),
      color(255, 69, 0),
      color(192, 192, 192),
    ],
  })
  // Palette 11: Candy Store
  allPalettes.push({
    name: 'Candy Store',
    colors: [
      color(255, 192, 203),
      color(135, 206, 250),
      color(255, 255, 102),
      color(152, 251, 152),
      color(255, 182, 193),
    ],
  })
  // Palette 12: Midnight City
  allPalettes.push({
    name: 'Midnight City',
    colors: [
      color(25, 25, 112),
      color(0, 0, 139),
      color(138, 43, 226),
      color(255, 215, 0),
      color(75, 0, 130),
    ],
  })
  // Palette 13: Pastel Dreams
  allPalettes.push({
    name: 'Pastel Dreams',
    colors: [
      color(255, 223, 230),
      color(221, 240, 255),
      color(230, 255, 230),
      color(255, 240, 220),
      color(240, 220, 255),
    ],
  })
  // Palette 14: Industrial Grey
  allPalettes.push({
    name: 'Industrial Grey',
    colors: [
      color(119, 136, 153),
      color(128, 128, 128),
      color(169, 169, 169),
      color(192, 192, 192),
      color(211, 211, 211),
    ],
  })
  // Palette 15: Autumn Leaves
  allPalettes.push({
    name: 'Autumn Leaves',
    colors: [
      color(218, 165, 32),
      color(184, 134, 11),
      color(160, 82, 45),
      color(205, 92, 92),
      color(139, 0, 0),
    ],
  })
  // Palette 16: Spring Blossom
  allPalettes.push({
    name: 'Spring Blossom',
    colors: [
      color(255, 182, 193),
      color(255, 192, 203),
      color(245, 222, 179),
      color(152, 251, 152),
      color(255, 240, 245),
    ],
  })
  // Palette 17: Deep Space
  allPalettes.push({
    name: 'Deep Space',
    colors: [
      color(0, 0, 50),
      color(20, 0, 70),
      color(100, 100, 255),
      color(200, 200, 255),
      color(150, 0, 200),
    ],
  })
  // Palette 18: Royal Court
  allPalettes.push({
    name: 'Royal Court',
    colors: [
      color(75, 0, 130),
      color(128, 0, 128),
      color(218, 165, 32),
      color(192, 192, 192),
      color(165, 42, 42),
    ],
  })
  // Palette 19: Citrus Burst
  allPalettes.push({
    name: 'Citrus Burst',
    colors: [
      color(255, 255, 0),
      color(255, 165, 0),
      color(124, 252, 0),
      color(255, 100, 0),
      color(50, 205, 50),
    ],
  })
  // Palette 20: Monochrome Noise
  allPalettes.push({
    name: 'Monochrome Noise',
    colors: [color(0), color(50), color(100), color(150), color(200), color(255)],
  }) // Added white
  // Palette 21: Sunset Fade
  allPalettes.push({
    name: 'Sunset Fade',
    colors: [
      color(252, 186, 3),
      color(252, 136, 3),
      color(252, 86, 3),
      color(199, 51, 11),
      color(140, 34, 4),
    ],
  })
  // Palette 22: Mint Chocolate
  allPalettes.push({
    name: 'Mint Chocolate',
    colors: [
      color(60, 179, 113),
      color(159, 226, 191),
      color(139, 69, 19),
      color(92, 64, 51),
      color(245, 245, 220),
    ],
  })
  // Palette 23: Berry Patch
  allPalettes.push({
    name: 'Berry Patch',
    colors: [
      color(220, 20, 60),
      color(199, 21, 133),
      color(75, 0, 130),
      color(123, 104, 238),
      color(255, 99, 71),
    ],
  })
  // Palette 24: Aquamarine Dream
  allPalettes.push({
    name: 'Aquamarine Dream',
    colors: [
      color(127, 255, 212),
      color(64, 224, 208),
      color(0, 206, 209),
      color(32, 178, 170),
      color(95, 158, 160),
    ],
  })
  // Palette 25: Fire and Ice
  allPalettes.push({
    name: 'Fire and Ice',
    colors: [
      color(255, 0, 0),
      color(255, 140, 0),
      color(255, 215, 0),
      color(0, 191, 255),
      color(135, 206, 250),
    ],
  })
  // Palette 26: Technicolor Haze
  allPalettes.push({
    name: 'Technicolor Haze',
    colors: [
      color(255, 0, 255, 150),
      color(0, 255, 255, 150),
      color(255, 255, 0, 150),
      color(0, 255, 0, 150),
      color(255, 0, 0, 150),
    ],
  })

  currentPaletteName = allPalettes[currentPaletteIndex].name

  setPaletteName(currentPaletteName)
}
