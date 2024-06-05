



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

function GetBrightness(speed) {
  // Speed to brightness 
  const brightness = Math.max(0, Math.min(255, Math.round(speed * 1000)));
  return brightness;
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
  const mouseX = (event.clientX - rect.left) / 5;
  const mouseY = (event.clientY - rect.top) / 5;

  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const index = y * 28 + x;
      const distance = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));
      const maxDistance = 10; // Adjust this value for the range of brightness you desire
      const brightness = Math.max(0, 255 - (distance / maxDistance) * 255);
      drawingPixels[index] = brightness;
      UpdateDrawPixel(index, brightness);
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



/*
const convertButton = document.getElementById('convert-button');
convertButton.addEventListener('click', () => {
    console.log('Drawn Pixels Array:', drawingPixels);
});
*/