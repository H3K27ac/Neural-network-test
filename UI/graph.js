const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

// Function to draw graph for a given function
function drawGraph(func) {
  const step = 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);

  for (let x = 0; x < canvas.width; x += step) {
    const y = canvas.height / 2 - func((x - canvas.width / 2) / graphscale) * graphscale;
    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = 'White';
  ctx.lineWidth = 2;
  ctx.stroke();
}

var scaleslider = document.getElementById("scaleslider");
var scaleoutput = document.getElementById("scalevalue");
var graphscale = 50;

scaleslider.oninput = function() {
  graphscale = this.value;
  drawGraph(testfunc);
  scaleoutput.innerHTML = this.value;
}

function testfunc(x) {
  return Math.sin(x);
}

drawGraph(testfunc);
