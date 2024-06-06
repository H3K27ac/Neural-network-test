const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
var graphscale = 50;
const tickLength = 10;
const tickSpacing = 250/4;

// Set canvas size
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

function drawGraph(func) {
    const step = 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // x-axis
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.strokeStyle = 'Gray'; 
    ctx.stroke();

    // y-axis
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'Gray';
    ctx.stroke();

    for (let x = tickSpacing; x < canvas.width; x += tickSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, canvas.height / 2 - tickLength / 2);
        ctx.lineTo(x, canvas.height / 2 + tickLength / 2);
        ctx.strokeStyle = 'White';
        ctx.stroke();

        const label = ((x - canvas.width / 2) / graphscale).toFixed(2);
        ctx.fillStyle = 'White';
        ctx.fillText(label, x - 5, canvas.height / 2 + 20);
    }

    for (let y = tickSpacing; y < canvas.height; y += tickSpacing) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - tickLength / 2, y);
        ctx.lineTo(canvas.width / 2 + tickLength / 2, y);
        ctx.strokeStyle = 'White';
        ctx.stroke();

        const label = ((canvas.height / 2 - y) / graphscale).toFixed(2);
        ctx.fillStyle = 'White';
    //    ctx.font = '12px Arial';
        ctx.fillText(label, canvas.width / 2 + 10, y + 5);
    }

    // Label x-axis
    ctx.fillStyle = 'White';
    ctx.fontSize = '20px';
    ctx.fillText('X', canvas.width - 20, canvas.height / 2 - 10);

    // Label y-axis
    ctx.fillText('Y', canvas.width / 2 + 10, 20);

    // Draw function
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

scaleslider.oninput = function() {
  graphscale = this.value;
  drawGraph(sigmoid);
  scaleoutput.innerHTML = this.value;
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-1 * x));
}


