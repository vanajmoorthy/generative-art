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

function setup() {
  let canvasWidth = 360
  let canvasHeight = 400
  canvas = createCanvas(canvasWidth, canvasHeight)
  canvas.parent('canvas-container')

  createControls()

  updateParametersFromSliders()

  definePalettes()
  createParticles()
  background(255)

  console.log('Current Palette:', currentPaletteName)

  npSlider.input(handleNumParticlesChange)
}

function draw() {
  updateParametersFromSliders()

  for (let p of particles) {
    p.update()
    p.display()
    p.checkEdges()
  }

  fill(255) // Set fill to background color (white)
  noStroke() // No border for the clearing rectangle
  // Adjust width/height if palette names are very long or font size changes

  // Step 2: Draw the Palette Name Text
  fill(50) // Set fill color for the text (dark grey)
  noStroke() // Ensure no stroke on the text itself
  textSize(14) // Choose a readable size
  textAlign(LEFT, TOP) // Align text starting from the top-left corner

  // Use the global variable to display the current palette name
  text(` ${currentPaletteName}`, 10, 8) // Draw text with a small margin (x=10, y=8)
}

function createControls() {
  let controlsDiv = select('#controls-container')

  nsSlider = createSlider(0.0001, 0.01, 0.001, 0.0001)
  nsValueSpan = createSpan('0.001')
  createControlRow(controlsDiv, 'Noise Scale:', nsSlider, nsValueSpan)

  amSlider = createSlider(0, 10, 3, 0.1)
  amValueSpan = createSpan('3.0')
  createControlRow(controlsDiv, 'Angle Mult:', amSlider, amValueSpan)

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

  npSlider = createSlider(100, 5000, 1000, 50)
  npValueSpan = createSpan('1000')
  createControlRow(controlsDiv, 'Particles:', npSlider, npValueSpan)
}

function createControlRow(parentDiv, labelText, slider, valueSpan) {
  let row = createDiv()
  row.addClass('control-row')

  let label = createSpan(labelText)
  label.parent(row)

  slider.parent(row)

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
  // First, check if a slider has focus (important!)
  let focused = document.activeElement
  if (focused && focused.type === 'range') {
    console.log('Slider focused, ignoring palette switch.')
    return // Don't switch palette if adjusting a slider
  }

  // --- Palette Switching Logic ---
  currentPaletteIndex++
  if (currentPaletteIndex >= allPalettes.length) {
    currentPaletteIndex = 0 // Wrap around
  }
  currentPaletteName = allPalettes[currentPaletteIndex].name
  console.log('Switched to Palette:', currentPaletteName)

  background(255) // Clear canvas
  createParticles() // Recreate with new palette
}

function doubleClicked() {
  // Optional but good practice: Check if the double-click was inside the canvas bounds
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    switchPalette() // Call the shared switching function
  }
}

function keyPressed() {
  // Check if the key pressed is the SPACEBAR
  if (key === ' ' || keyCode === 32) {
    switchPalette() // Call the shared switching function
  }
}

function definePalettes() {
  // --- KEEP YOUR EXISTING PALETTES HERE ---
  // Example: Electric Sunset, Neon Future, Tropical Punch, Ocean Depth, Retro Pop, Vivid Contrast, Soft Glow

  // Palette 0: Electric Sunset
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

  // --- ADDING 20 NEW PALETTES ---

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
  }) // With alpha

  // Ensure currentPaletteIndex is valid and set initial name
  currentPaletteName = allPalettes[currentPaletteIndex].name
}
