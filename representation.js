let weights = [0];
let neurons = [];
let neurons2 = [];
let biases = [0];
let structure = [];
let targets = [];
let layers;

// Batch normalisation variables
let batch = [];
let batchbeta = [0];
let batchgamma = [0];
let batchmean = [0];
let batchvar = [0];
let batchmeanmoving = [0];
let batchvarmoving = [0];
let batchsize;
let batchcount;
let batchnorm = "none";

// Input variables
let learnrate;
let l1strength;
let l2strength;
let weightrange;
let biasrange;



function DeleteGraph() {
  clearInterval(training);
  training = undefined;
  traincount = 0;
  weights = [0];
  neurons = [];
  neurons2 = [];
  biases = [0];
  structure = [];
  targets = [];
  layers = 0;
  learnrate = 0;
  l1strength = 0;
  l2strength = 0;
  weightrange = 0;
  biasrange = 0;
  batch = [];
  batchbeta = [0];
  batchgamma = [0];
  batchmean = [0];
  batchvar = [0];
  batchmeanmoving = [0];
  batchvarmoving = [0];
  batchsize = 0;
  batchcount = 0;
  batchnorm = "none";
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
  if (value == 0) return `rgb(255, 255, 255)`
  if (type == "weight") {
    valuerange = weightrange
  } else {
    valuerange = biasrange
  }
  let red = value > 0 ? 255 : Math.round(255 * (1 + (value / valuerange)));
  let green = Math.round(255 * (1 - Math.abs(value / valuerange)));
  let blue = value > 0 ? Math.round(255 * (1 - (value / valuerange))) : 255;
  return `rgb(${red}, ${green}, ${blue})`;
}

function Color2(value) {
  let brightness = Math.round(255 * value);
  return `rgb(${brightness}, ${brightness}, ${brightness})`;
}

function UpdateColor() {
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i]; j++) {
      let neuronvalue = neurons[i][j]
      let neuron = document.getElementById("neuron " + i + "," + j)
      neuron.style.backgroundColor = Color2(neuronvalue)
    }
    for (let j=0; j<structure[i+1]; j++) { 
      let biasvalue = biases[i+1][j]
      let neuron = document.getElementById("neuron " + (i+1) + "," + j)
      neuron.style.borderColor = Color(biasvalue,"bias")
      for (let k=0; k<structure[i]; k++) {
        let weightvalue = weights[i+1][j][k]
        let weight = document.getElementById("weight " + (i+1) + "," + j + "," + k)
        weight.style.backgroundColor = Color(weightvalue,"weight")
      }
    }
  }
}

function ClearNeurons() {
  for (let i=1; i<layers; i++) {
    for (let j=0; j<structure[i]; j++) {
      neurons[i][j] = 0
    }
  }
}

function RandomizeInput() {
  ClearNeurons()
  for (let j=0; j<structure[0]; j++) {
      neurons[0][j] = Math.random();
  }
}

function Randomize() {
  ClearNeurons()
  for (let j=0; j<structure[0]; j++) {
      neurons[0][j] = Math.random();
  }
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      biases[i+1][j] = (Math.random() * 2 - 1) * biasrange;
      for (let k=0; k<structure[i]; k++) {
        weights[i+1][j][k] = (Math.random() * 2 - 1) * weightrange;
      }
    }
  }
}

function ChooseFunction(name) {
  activation = name
}

function CreateGraph() {
  DeleteGraph()
  let structureinput = document.getElementById("structure").value
  structure = structureinput.replace(/[{}]/g, '').split(',').map(item => parseInt(item));
  layers = structure.length
  structure.push(0)

  learnrate = document.getElementById("learnrate").value
  weightrange = document.getElementById("weightrange").value
  biasrange = document.getElementById("biasrange").value
  l1strength = document.getElementById("L1strength").value
  l2strength = document.getElementById("L2strength").value
  
  activation = String(document.getElementById("activation").value).trim()

  for (let i=0; i<structure[0]; i++) {
    let input = document.createElement("input")
    input.className = "input"
    input.id = "input " + i
    document.getElementById("inputfield").appendChild(input)
  }
  
  for (let i=0; i<structure[layers-1]; i++) {
    targets.push(0)
  }
  
  for (let i=0; i<layers; i++) {
    let subarray = [];
    let batchsubarray = [];
    let column = document.createElement("div")
    column.className = "column"
    column.id = "column " + i
    for (let j=0; j<structure[i]; j++) {
      let subsubarray = [];
      let neuron = document.createElement("div")
      neuron.className = "neuron"
      neuron.id = "neuron " + i + "," + j
      column.appendChild(neuron)
      subarray.push(0)
      if (batchnorm != "none") {
        for (let k=0; k<batchsize; k++) {
          subsubarray.push(0)
        }
        batchsubarray.push(subsubarray)
      }
    }
    document.getElementById("container").appendChild(column)
    if (batchnorm != "none") {
      batch.push(batchsubarray)
      neurons.push(batchsubarray)
      neurons2.push(batchsubarray)
      batchbeta.push(0)
      batchgamma.push(0)
      batchmean.push(subarray)
      batchvar.push(subarray)
      batchmeanmoving.push(subarray)
      batchvarmoving.push(subarray)
    } else {
      neurons.push(subarray)
      neurons2.push(subarray)
    }
  }
  
  
  for (let i=0; i<layers; i++) {
    let subarray = [];
    let subarray2 = [];
    for (let j=0; j<structure[i+1]; j++) {
      let subsubarray = [];
      subarray2.push(0)
      for (let k=0; k<structure[i]; k++) {
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
        subsubarray.push(0)
      }
      subarray.push(subsubarray)
    }
    weights.push(subarray)
    biases.push(subarray2)
  }
  
  document.getElementById("layers").innerHTML = layers
}


