const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
var currentgraph;
var graphscale = 50;
const tickLength = 10;
const tickSpacing = 50;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;


function clearGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawGraph(func) {
  const step = 1;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.strokeStyle = 'Gray';
  ctx.lineWidth = 0.5;

  for (let y = 0; y < canvas.height; y += 1) {
    const yPos = y - canvas.height / 2;
    if (yPos % graphscale === 0 && yPos != 0) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
  }
  for (let x = 0; x < canvas.width; x += 1) {
    const xPos = x - canvas.width / 2;
    if (xPos % graphscale === 0 && xPos != 0) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
  }
  ctx.stroke();

  // x-axis
  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.strokeStyle = 'Gray'; 
  ctx.lineWidth = 1;
  ctx.stroke();

  // y-axis
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.strokeStyle = 'Gray';
  ctx.lineWidth = 1;
  ctx.stroke();

  for (let x = tickSpacing; x < canvas.width; x += tickSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, canvas.height / 2 - tickLength / 2);
    ctx.lineTo(x, canvas.height / 2 + tickLength / 2);
    ctx.strokeStyle = 'White';
    ctx.stroke();

    const label = ((x - canvas.width / 2) / graphscale).toFixed(2);
    ctx.fillStyle = 'White';
    ctx.fillText(label, x - 5, canvas.height / 2 + 15);
  }

  for (let y = tickSpacing; y < canvas.height; y += tickSpacing) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - tickLength / 2, y);
    ctx.lineTo(canvas.width / 2 + tickLength / 2, y);
    ctx.strokeStyle = 'White';
    ctx.stroke();

    const label = ((canvas.height / 2 - y) / graphscale).toFixed(2);
    ctx.fillStyle = 'White';
      //  ctx.font = '12px Arial';
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
  if (currentgraph) drawGraph(currentgraph);
  scaleoutput.innerHTML = this.value;
}

let currentlayer = "none";

function SelectCost(costfunc) {
  let button;
  button = document.getElementById("selectmse");
  cost = costfunc;
  button.style.color = "Lime";
  button.style.borderColor = "Lime";
}

function SetAct(act,func,dxfunc) {
  if (currentlayer == "hidden") {
    hiddenactivation = act;
    hiddenfunc = func;
    dxhiddenfunc = dxfunc;
  } else if (currentlayer == "output") {
    outputactivation = act;
    outputfunc = func;
    dxoutputfunc = dxfunc;
  }
}

function SelectLayer(layer) {
  let button, button2;
  if (layer == "hidden") {
    button = document.getElementById("selecthidden");
    button2 = document.getElementById("selectoutput");
  } else {
    button = document.getElementById("selectoutput");
    button2 = document.getElementById("selecthidden");
  }
  if (layer != currentlayer) {
    currentlayer = layer;
    button.style.color = "Lime";
    button.style.borderColor = "Lime";
    button2.style.color = "White";
    button2.style.borderColor = "White";
  } else {
    currentlayer = "none";
    button.style.color = "White";
    button.style.borderColor = "White";
  }
}

function SelectAct(act,buttonid,func,dxfunc,draw=true) {
  let button = document.getElementById(buttonid);
  if (draw) {
    if (act == "Softmax") {
      clearGraph();
    } else {
      drawGraph(func);
    }
  }
  currentgraph = func;
  if (currentlayer == "hidden") {
    let indicator = document.getElementById("hiddenindicator")
    button.appendChild(indicator);
    hiddenactivation = act;
    hiddenfunc = func;
    dxhiddenfunc = dxfunc;
  } else if (currentlayer == "output") {
    let indicator = document.getElementById("outputindicator")
    button.appendChild(indicator);
    outputactivation = act;
    outputfunc = func;
    dxoutputfunc = dxfunc;
  }
}

function getDefaultButtonId(act) {
  return act.toLowerCase() + "button";
}

function getDefaultFunc(act) {
  return window[act];
}

function getDefaultDxFunc(act) {
  return window["Dx" + act];
}

function CreateActivationBtns() {
  let container = document.getElementById("activationcontainer");
  for (let i = 0; i < actFunctions.length; i++) {
    let act = actFunctions[i];
    let button = document.createElement("button");
    button.className = "ActivationButton";
    button.id = act.toLowerCase() + "button";
    button.innerHTML = act;
    button.onclick = function () {
      SelectAct(act,act.toLowerCase() + "button",window[act],window["Dx" + act]);
    }
    container.appendChild(button);
  }
}

function ImportActivation(act) {
  SetAct(act,window[act],window["Dx" + act]);
}

let actFunctions = ["None","Sigmoid","ReLU","Tanh","TanhShrink","Softmax","SoftSign","Swish"];

function Sigmoid(x) {
  return 1 / (1 + Math.exp(-1 * x));
}

function DxSigmoid(x,actcache) {
  return actcache * (1 - actcache)
}

function ReLU(x) {
  return Math.max(0, x);
}

function DxReLU(x) {
  return x > 0 ? 1 : 0;
}

function Tanh(x) {
  return Math.tanh(x);
}

function DxTanh(x,actcache) {
  return 1 - Math.pow(actcache, 2);
}

function TanhShrink(x) {
  return x - Math.tanh(x);
}

function DxTanhShrink(x,actcache) {
  return 2 - Math.pow(actcache, 2);
}

function Softmax(x,sum) {
  return Math.exp(x) / sum;
}

function DxSoftmax(x,actcache) {
  return actcache * (1 - actcache);
}

function SoftSign(x) {
  return x / (1 + Math.abs(x));
}

function DxSoftSign(x) {
  return 1 / (1 + Math.abs(x)) ** 2;
}

function Swish(x) {
  return x * Sigmoid(x);
}

function DxSwish(x,actcache) {
  return actcache + Sigmoid(x) * (1 - actcache);
}

function None(x) {
  return x;
}

function DxNone(x) {
  return 1;
}
