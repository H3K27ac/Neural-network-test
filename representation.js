var weights = [0];
var neurons = [];
var neurons2 = [];
var biases = [0];
var structure = [];
var structure2 = [0];
var structure3 = [0];
var targets = [];
var layers;

let neuroncount = 0;
let weightcount = 0;
let weightrange;
let biasrange;

let learnrate = 0;

// Visuals
let showneurons = "all";
let showbiases = true;
let showweights = true;



function DeleteGraph() {
  clearInterval(training);
  training = undefined;
  traincount = 0;
  weights = [0];
  neurons = [];
  neurons2 = [];
  biases = [0];
  structure = [];
  structure2 = [0];
  structure3 = [0];
  targets = [];
  layers = 0;
  neuroncount = 0;
  weightcount = 0;
  let graph = document.getElementById("container");
  while (graph.hasChildNodes()) {
      graph.removeChild(graph.firstChild);
  }
  let field = document.getElementById("inputfield");
  while (field.hasChildNodes()) {
      field.removeChild(field.firstChild);
  }
}

function Color(value,type) {
  let valuerange;
  let red;
  let green;
  let blue;
  switch (type) {
    case "weight":
      valuerange = weightrange
      break;
    case "bias":
      valuerange = biasrange
      break;
    default:
      break;
  }
  if (type == "batchgamma") {
    if (value == 1) return `rgb(255, 255, 255)`
    let value2 = Math.log(value) / Math.log(valuerange)
    red = value2 > 0 ? 255 : Math.round(255 * (1 + value2));
    green = Math.round(255 * (1 - Math.abs(value2)));
    blue = value2 > 0 ? Math.round(255 * (1 - value2)) : 255;
  } else {
    if (value == 0) return `rgb(255, 255, 255)`
    let value3 = value / valuerange
    red = value > 0 ? 255 : Math.round(255 * (1 + value3));
    green = Math.round(255 * (1 - Math.abs(value3)));
    blue = value > 0 ? Math.round(255 * (1 - value3)) : 255;
  }
  return `rgb(${red}, ${green}, ${blue})`;
}

function Color2(value) {
  let brightness = Math.round(255 * value);
  return `rgb(${brightness}, ${brightness}, ${brightness})`;
}

function UpdateColor() {
  if (showneurons == "output") {
    let i2 = structure[layers-1]
    for (let i=0; i<i2; i++) {
      neuronvalue = neurons[structure2[layers-1]+i].toFixed(2)
      let neuron = document.getElementById("neuron " + (layers-1) + "," + i)
      neuron.style.backgroundColor = Color2(neuronvalue)
      let neuronvaluetext = document.getElementById("neuronvalue " + (layers-1) + "," + i)
      neuronvaluetext.innerHTML = neuronvalue
      if (neuronvalue > 0.5) {
        neuronvaluetext.style.color = `rgb(0,0,0)`
      } else {
        neuronvaluetext.style.color = `rgb(255,255,255)`
      }
    }
  } else {
  for (let i=0; i<layers; i++) {
    let j2 = structure[i]
    for (let j=0; j<j2; j++) {
      let neuronvalue;
      neuronvalue = neurons[structure2[i]+j].toFixed(2)
      let neuron = document.getElementById("neuron " + i + "," + j)
      neuron.style.backgroundColor = Color2(neuronvalue)
      let neuronvaluetext = document.getElementById("neuronvalue " + i + "," + j)
      neuronvaluetext.innerHTML = neuronvalue
      if (neuronvalue > 0.5) {
        neuronvaluetext.style.color = `rgb(0,0,0)`
      } else {
        neuronvaluetext.style.color = `rgb(255,255,255)`
      }
    }
    let j3 = structure[i+1]
    for (let j=0; j<j3; j++) { 
      if (showbiases) {
      let biasvalue = biases[structure2[i+1]+j+1].toFixed(2)
      let neuron = document.getElementById("neuron " + (i+1) + "," + j)
      neuron.style.borderColor = Color(biasvalue,"bias")
      }
      if (showweights) {
        let index = structure3[i]+structure[i]*j+1
      for (let k=0; k<j2; k++) {
        let weightvalue = weights[index+k].toFixed(2)
        let weight = document.getElementById("weight " + (i+1) + "," + j + "," + k)
        weight.style.backgroundColor = Color(weightvalue,"weight")
      }
      }
    }
  }
}
}

function ClearNeurons() {
  for (let i=1; i<layers; i++) {
    let j2 = structure[i]
    for (let j=0; j<j2; j++) {
      neurons[i][j] = 0
    }
  }
}


function RandomizeInput() {
  let j2 = structure[0]
  for (let j=0; j<j2; j++) {
      neurons[j] = Math.random();
  }
}



function Randomize() {
//  for (let j=0; j<structure[0]; j++) {
   //   neurons[0][j] = Math.random();
//  }
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      biases[structure2[i+1]+j] = (Math.random() * 2 - 1) * biasrange;
      let index = structure3[i]+structure[i]*j+1
      for (let k=0; k<structure[i]; k++) {
        weights[index+k] = (Math.random() * 2 - 1) * weightrange;
      }
    }
  }
}


function SetInputs() {
  let container = document.getElementById("container")
//  let structureinput = document.getElementById("structure").value
//  structure = structureinput.replace(/[{}]/g, '').split(',').map(item => parseInt(item));
//  layers = structure.length
//  document.getElementById("structuredisplay").innerHTML = "Structure: " + JSON.stringify(structure)
  structure.push(0)
  
  learnrate = Number(document.getElementById("learnrate").value)
  weightrange = document.getElementById("weightrange").value
  biasrange = document.getElementById("biasrange").value
  l1strength = document.getElementById("L1strength").value
  l2strength = document.getElementById("L2strength").value
  
  showweights = document.getElementById("showweights").checked
  showbiases = document.getElementById("showbiases").checked

  
if (document.getElementById("showneurons").checked == true) {
    showneurons = "all"
  } else {
    showneurons = "output"
  }
  
  hiddenactivation = String(document.getElementById("hiddenactivation").value).trim()
  outputactivation = String(document.getElementById("outputactivation").value).trim()

  for (let i=0; i<layers; i++) {
    neuroncount += structure[i]
    structure2.push(neuroncount)
    if (i>0) { 
      weightcount += structure[i] * structure[i-1]
      structure3.push(weightcount)
    }
  }

  neurons = new Float32Array(neuroncount).fill(0)
  neurons2 = new Float32Array(neuroncount+1).fill(0)
  weights = new Float32Array(weightcount+1).fill(0)
  biases = new Float32Array(neuroncount+1).fill(0)
  targets = new Float32Array(structure[layers-1]).fill(0)
  
  document.getElementById("neuroncount").innerHTML = "Number of neurons: " + neuroncount
  document.getElementById("weightcount").innerHTML = "Number of weights: " + weightcount
  document.getElementById("layercount").innerHTML = "Number of layers: " + layers
}

function CreateGraph() {
  DeleteGraph()
  SetInputs()
  
  for (let i=0; i<structure[0]; i++) {
    let input = document.createElement("input")
    input.className = "input"
    input.id = "input " + i
    document.getElementById("inputfield").appendChild(input)
  }
  
  for (let i=0; i<layers; i++) {
    let column;
    if (showneurons == "all") {
    column = document.createElement("div")
    column.className = "column"
    column.id = "column " + i
    }
    let j2 = structure[i]
    for (let j=0; j<j2; j++) {
      if (showneurons == "all" || i==layers-1) {
      let neuron = document.createElement("div")
      neuron.className = "neuron"
      neuron.id = "neuron " + i + "," + j
      let neuronvalue = document.createElement("span")
      neuronvalue.className = "neuronvalue"
      neuronvalue.id = "neuronvalue " + i + "," + j
      neuron.appendChild(neuronvalue)
        if (showneurons == "all") {
          column.appendChild(neuron)
        } else {
          container.appendChild(neuron)
        }
      }
    }
    if (showneurons == "all") {
      document.getElementById("layers").innerHTML = "notworking"
      container.appendChild(column)
    }
  }
  
  for (let i=0; i<layers-1; i++) {
    let j2 = structure[i+1]
    for (let j=0; j<j2; j++) {
      let k2 = structure[i]
      for (let k=0; k<k2; k++) {
        if (showweights) {
        let weight = document.createElement("div")
        weight.className = "weight"
        weight.id = "weight " + (i+1) + "," + j + "," + k
        let neuron1 = document.getElementById("neuron " + i + "," + k)
        let neuron2 = document.getElementById("neuron " + (i+1) + "," + j)
        const x1 = neuron1.offsetLeft + neuron1.offsetWidth / 2;
        const y1 = neuron1.offsetTop + neuron1.offsetHeight / 2;
        const x2 = neuron2.offsetLeft + neuron2.offsetWidth / 2;
        const y2 = neuron2.offsetTop + neuron2.offsetHeight / 2;

        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;

        weight.style.width = length + "px";
        weight.style.transform = `rotate(${angle}rad)`;
        weight.style.left = centerX - (length / 2) + "px";
        weight.style.top = centerY + "px";
        document.getElementById("container").appendChild(weight)
        }
      }
    }
  }
}


