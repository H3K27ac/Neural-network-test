



function CreatePixels() {
  const container = document.getElementById('pixel-container');
  for (let i = 0; i < structure[0]; i++) {
    const pixel = document.createElement('div');
    pixel.className = "Pixel";
    pixel.id = "pixel " + i;
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

