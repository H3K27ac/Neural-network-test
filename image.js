



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
    pixel.className = "DrawPixel ";
    pixel.id = "drawpixel " + i;
    container.appendChild(pixel);
  }
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

  for (let y = mouseY-2; y < mouseY+2; y++) {
    if (y>0 && y<28) {
    for (let x = mouseX-2; x < mouseX+2; x++) {
      if (x>0 && x<28) {
      const index = y * 28 + x;
      const distance = Math.hypot(x - mouseX, y - mouseY);
      const maxDistance = 2; 
      drawingPixels[index] = Math.max(0, drawingPixels[index] + (255 - (distance / maxDistance) * 255));
      UpdateDrawPixel(index, drawingPixels[index]);
      }
    }
    }
  }
}


function UpdateDrawPixel(index, brightness) {
  const pixel = document.getElementById("drawpixel " + index);
  pixel.style.backgroundColor = `rgb(${brightness}, ${brightness}, ${brightness})`;
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
    neurons[i] = drawingPixels[i];
  }
}

/*
const convertButton = document.getElementById('convert-button');
convertButton.addEventListener('click', () => {
    console.log('Drawn Pixels Array:', drawingPixels);
});
*/