



function CreatePixels() {
  const container = document.getElementById('pixel-container');
  for (let i = 0; i < structure[0]; i++) {
    const pixel = document.createElement('div');
    pixel.className = "Pixel";
    pixel.id = "pixel " + i;
    container.appendChild(pixel);
  }
}

function CreateDrawPixels() {
  const container = document.getElementById('drawing-container');
  for (let i = 0; i < structure[0]; i++) {
    const pixel = document.createElement('div');
    pixel.className = "DrawPixel";
    pixel.id = "drawpixel " + i;
    container.appendChild(pixel);
  }
  drawPixels = Array.from({ length: 28 * 28 }, (_, index) =>
    document.getElementById("drawpixel " + index)
  );
}

function UpdatePixels() {
  for (let i = 0; i < structure[0]; i++) {
    const pixel = document.getElementById("pixel " + i);
    const brightness = neurons[i] * 255;
    pixel.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;
  }
}

function UpdateDrawingPixels() {
  for (let i = 0; i < structure[0]; i++) {
    const pixel = document.getElementById("drawpixel " + i);
    const brightness = drawingPixels[i] * 255;
    pixel.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;
  }
}

// Drawing images
const drawingContainer = document.getElementById('drawing-container');
const drawingPixels = new Array(784).fill(0); 
let drawPixels; 

let isDrawing = false;

function ClearPixels() {
  drawingPixels.fill(0);
  UpdateDrawingPixels();
}

function StartDraw(event) {
  isDrawing = true;
  Draw(event);
}

function EndDraw() {
  isDrawing = false;
}

function Draw(event) {
  if (!isDrawing) return;

  const rect = drawingContainer.getBoundingClientRect();
  const mouseX = Math.floor((event.clientX - rect.left) / 5);
  const mouseY = Math.floor((event.clientY - rect.top) / 5);

  const maxDistance = 1.414; // This is not the maximum, it just looks better

  const startX = Math.max(0, mouseX - 1);
  const endX = Math.min(27, mouseX + 1);
  const startY = Math.max(0, mouseY - 1);
  const endY = Math.min(27, mouseY + 1);

  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      if (x === mouseX || y === mouseY) { // Only update orthogonal adjacent pixels
        const index = y * 28 + x;
        const distance = x == mouseX && y == mouseY ? 0 : 1; // Manhattan distance
        const brightness = 255 - (distance / maxDistance) * 255;
        drawingPixels[index] = Math.floor(Math.min(255, Math.max(0, drawingPixels[index] + brightness)));
        UpdateDrawPixel(index, drawingPixels[index]);
      }
    }
  }
}

function UpdateDrawPixel(index, brightness) {
  drawPixels[index].style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;
}


drawingContainer.addEventListener('mousedown', (event) => StartDraw(event));
drawingContainer.addEventListener('mousemove', (event) => Draw(event));
document.addEventListener('mouseup', EndDraw);

drawingContainer.addEventListener('touchstart', (event) => {
  StartDraw(event.touches[0]);
  event.preventDefault();
});
drawingContainer.addEventListener('touchmove', (event) => {
  Draw(event.touches[0]);
  event.preventDefault();
});
document.addEventListener('touchend', EndDraw);
document.addEventListener('touchcancel', EndDraw);

function SubmitDrawing() {
  for (let i=0; i<structure[0]; i++) {
    neurons[i] = drawingPixels[i] / 255;
  }
  targets.fill(0)
  FeedForward();
  UpdateGraph(false);
}

/*
const convertButton = document.getElementById('convert-button');
convertButton.addEventListener('click', () => {
    console.log('Drawn Pixels Array:', drawingPixels);
});
*/