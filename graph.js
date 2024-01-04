let weights = [0];
let neurons = [];
let neurons2 = [];
let biases = [0];
let structure = [];
let targets = [];
let layers;


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
  targets = [];
  layers = 0;
  let graph = document.getElementById("container");
  while (graph.hasChildNodes()) {
      graph.removeChild(graph.firstChild);
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
      neuronvalue = neurons[layers-1][i].toFixed(2)
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
      let neuronvalue = neurons[i][j].toFixed(2)
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
      let biasvalue = biases[i+1][j].toFixed(2)
      let neuron = document.getElementById("neuron " + (i+1) + "," + j)
      neuron.style.borderColor = Color(biasvalue,"bias")
      }
      if (showweights) {
      for (let k=0; k<j2; k++) {
        let weightvalue = weights[i+1][j][k].toFixed(2)
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
      if (batchnorm) {
        for (let n=0; n<batchsize; n++) {
          neurons[i][j][n] = 0
        }
      } else {
        neurons[i][j] = 0
      }
    }
  }
}


function RandomizeInput() {
  ClearNeurons()
  let j2 = structure[0]
  for (let j=0; j<j2; j++) {
      neurons[0][j] = Math.random();
  }
}



function Randomize() {
  ClearNeurons()
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      biases[i+1][j] = (Math.random() * 2 - 1) * biasrange;
      for (let k=0; k<structure[i]; k++) {
        weights[i+1][j][k] = (Math.random() * 2 - 1) * weightrange;
      }
    }
  }
}

function SetInputs() {
  let container = document.getElementById("container")
  let structureinput = document.getElementById("structure").value
  structure = structureinput.replace(/[{}]/g, '').split(',').map(item => parseInt(item));
  layers = structure.length
  document.getElementById("structuredisplay").innerHTML = "Structure: " + JSON.stringify(structure)
  structure.push(0)

  learnrate = Number(document.getElementById("learnrate").value)
  weightrange = document.getElementById("weightrange").value
  biasrange = document.getElementById("biasrange").value
}

function SetArrays() {
  for (let i=0; i<layers; i++) {
    let neuronssubarray = [];
    let neurons2subarray = [];
    let biasessubarray = [];
    let weightssubarray = [];
    let j2 = structure[i]
    for (let j=0; j<j2; j++) {
      neuronssubarray.push(0)
      neurons2subarray.push(0)
      if (i == layers-1) targets.push(0)
      if (i>0) {
        biasessubarray.push(0)
        let weightssubsubarray = [];
        let k2 = structure[i-1]
        for (let k=0; k<k2; k++) {
          weightssubsubarray.push(0)
        }
        weightssubarray.push(weightssubsubarray)
      }
    }
    neurons.push(neuronssubarray)
    neurons2.push(neurons2subarray)
    biases.push(biasessubarray)
    weights.push(weightssubarray)
  }
}


function CreateGraph() {
  DeleteGraph()
  SetInputs()
  SetArrays()
  let neuroncount = structure[0];
  let weightcount = 0;
  for (let i=0; i<layers-1; i++) {
    weightcount += structure[i] * structure [i+1]
    neuroncount += structure[i+1]
  }
  document.getElementById("neuroncount").innerHTML = "Number of neurons: " + neuroncount
  document.getElementById("weightcount").innerHTML = "Number of weights: " + weightcount
  document.getElementById("layercount").innerHTML = "Number of layers: " + layers
  
  for (let i=0; i<layers; i++) {
    let neuronssubarray = [];
    let neurons2subarray = [];
    let column = document.createElement("div")
    column.className = "column"
    column.id = "column " + i
    let j2 = structure[i]
    if (j2 > 10) {
      for (let j=0; j<3; j++) {
        let neuron = document.createElement("div")
        neuron.className = "neuron"
        neuron.id = "neuron " + i + "," + j
        let neuronvalue = document.createElement("span")
        neuronvalue.className = "neuronvalue"
        neuronvalue.id = "neuronvalue " + i + "," + j
        neuron.appendChild(neuronvalue)
        column.appendChild(neuron)
      }
      for (let j=0; j<7; j++) {
        if (j=3) {
          let neuronnum = document.createElement("span")
          neuronnum.className = "neuronvalue"
          neuronnum.innerHTML = j2 - 6
          column.appendChild(neuronnum)
        } else {
          let dot = document.createElement("div")
          dot.className = "dot"
          column.appendChild(dot)
        }
      }
      for (let j=layers-3; j<layers-1; j++) {
        let neuron = document.createElement("div")
        neuron.className = "neuron"
        neuron.id = "neuron " + i + "," + j
        let neuronvalue = document.createElement("span")
        neuronvalue.className = "neuronvalue"
        neuronvalue.id = "neuronvalue " + i + "," + j
        neuron.appendChild(neuronvalue)
        column.appendChild(neuron)
      }
    } else {
      for (let j=0; j<j2; j++) {
        let neuron = document.createElement("div")
        neuron.className = "neuron"
        neuron.id = "neuron " + i + "," + j
        let neuronvalue = document.createElement("span")
        neuronvalue.className = "neuronvalue"
        neuronvalue.id = "neuronvalue " + i + "," + j
        neuron.appendChild(neuronvalue)
        column.appendChild(neuron)
    }
    }
    container.appendChild(column)
  }
}
