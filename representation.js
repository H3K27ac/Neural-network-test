var weights = [0];
var neurons = [];
var neurons2 = [];
var biases = [0];
var structure = [];
var structure2 = [0];
var structure3 = [0];
var targets = [];
var layers = 0;

var neuroncount = 0;
var weightcount = 0;
var weightrange = 1;
var biasrange = 1;

var learnrate = 0;

// Visuals
var showneurons = "all";
var showbiases = true;
var showweights = true;
var hideneurons = [];


function DeleteGraph() {
  let graph = document.getElementById("container");
  while (graph.hasChildNodes()) {
      graph.removeChild(graph.firstChild);
  }
 // let field = document.getElementById("inputfield");
//  while (field.hasChildNodes()) {
//      field.removeChild(field.firstChild);
//  }
}

function Color(value,type) {
  let valuerange;
  let red;
  let green;
  let blue;
  switch (type) {
    case "weight":
      valuerange = weightrange;
      break;
    case "bias":
      valuerange = biasrange;
      break;
    default:
      break;
  }
  if (type == "batchgamma") {
    if (value == 1) return `rgb(255, 255, 255)`
    let value2 = Math.log(value) / Math.log(valuerange);
    red = value2 > 0 ? 255 : Math.round(255 * (1 + value2));
    green = Math.round(255 * (1 - Math.abs(value2)));
    blue = value2 > 0 ? Math.round(255 * (1 - value2)) : 255;
  } else {
    if (value == 0) return `rgb(255, 255, 255)`
    let value3 = value / valuerange;
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

function UpdateTarget(i) {
  let targetvalue;
  targetvalue = targets[i].toFixed(2);
  let target = document.getElementById("target " + i);
  target.style.backgroundColor = Color2(targetvalue);
  let targetvaluetext = document.getElementById("targetvalue " + i);
  targetvaluetext.innerHTML = targetvalue;
  if (targetvalue > 0.5) {
    targetvaluetext.style.color = `rgb(0,0,0)`;
  } else {
    targetvaluetext.style.color = `rgb(255,255,255)`;
  }
}

function UpdateNeuron(i,j) {
  let neuronvalue;
  neuronvalue = neurons[structure2[i]+j].toFixed(2);
  let neuron = document.getElementById("neuron " + i + "," + j);
  neuron.style.backgroundColor = Color2(neuronvalue);
  let neuronvaluetext = document.getElementById("neuronvalue " + i + "," + j);
  neuronvaluetext.innerHTML = neuronvalue;
  if (neuronvalue > 0.5) {
    neuronvaluetext.style.color = `rgb(0,0,0)`;
  } else {
    neuronvaluetext.style.color = `rgb(255,255,255)`;
  }
}

function UpdateBiases(i,j) {
  if (showbiases) {
    let biasvalue = biases[structure2[i+1]+j+1].toFixed(2);
    let neuron = document.getElementById("neuron " + (i+1) + "," + j);
    neuron.style.borderColor = Color(biasvalue,"bias");
  }
}

function UpdateWeights(i,j,j2) {
  let index = structure3[i]+structure[i]*j+1;
  if (hideneurons[i]) {
    for (let k=0; k<5; k++) {
      let weightvalue = weights[index+k].toFixed(2);
      let weight = document.getElementById("weight " + (i+1) + "," + j + "," + k);
      weight.style.backgroundColor = Color(weightvalue,"weight");
    }
    for (let k=j2-5; k<j2; k++) {
      let weightvalue = weights[index+k].toFixed(2);
      let weight = document.getElementById("weight " + (i+1) + "," + j + "," + k);
      weight.style.backgroundColor = Color(weightvalue,"weight");
    }
  } else {
    for (let k=0; k<j2; k++) {
      let weightvalue = weights[index+k].toFixed(2);
      let weight = document.getElementById("weight " + (i+1) + "," + j + "," + k);
      weight.style.backgroundColor = Color(weightvalue,"weight");
    }
  }
}

function UpdateColor() {
  for (let i=0; i<layers; i++) {
    let j2 = structure[i];
    let j3 = structure[i+1];
    if (hideneurons[i]) {
      for (let j=0; j<5; j++) {
        UpdateNeuron(i,j);
        if (i==layers-1 && showtargets) UpdateTarget(j);
      }
      for (let j=j2-5; j<j2; j++) {
        UpdateNeuron(i,j);
        if (i==layers-1 && showtargets) UpdateTarget(j);
      }
    } else {
      for (let j=0; j<j2; j++) {
        UpdateNeuron(i,j);
        if (i==layers-1 && showtargets) UpdateTarget(j);
      }
    }
    if (hideneurons[i+1]) {
      for (let j=0; j<5; j++) {
        UpdateBiases(i,j);
        UpdateWeights(i,j,j2);
      }
      for (let j=j3-5; j<j3; j++) {
        UpdateBiases(i,j);
        UpdateWeights(i,j,j2);
      }
    } else {
      for (let j=0; j<j3; j++) {
        UpdateBiases(i,j);
        UpdateWeights(i,j,j2);
      }
    }
  }
}


function FillColor(color) {
  let elements = document.getElementsByClassName("Neuron");
  let i2 = elements.length;
  for (let i = 0; i < i2; i++) {
    let element = elements[i];
    element.style.borderColor = color;
  }
  elements = document.getElementsByClassName("Weight");
  i2 = elements.length;
  for (let i = 0; i < i2; i++) {
    let element = elements[i];
    element.style.backgroundColor = color;
  }
}

function ClearNeurons() {
  for (let i=1; i<layers; i++) {
    let j2 = structure[i];
    for (let j=0; j<j2; j++) {
      neurons[i][j] = 0;
    }
  }
}


function RandomizeInput() {
  let j2 = structure[0];
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
      let index = structure3[i]+structure[i]*j+1;
      for (let k=0; k<structure[i]; k++) {
        weights[index+k] = (Math.random() * 2 - 1) * weightrange;
      }
    }
  }
}

function CreateGraph() {
  
  for (let i=0; i<layers+1; i++) {
    let column;
    column = document.createElement("div");
    column.className = "Column";
    column.id = "column " + i;
    let j2 = structure[i];
    if (i==layers) {
      j2 = structure[i-1];
      column.className = "TargetColumn";
      if (!showtargets) column.style.display = "none";
    }
    if (hideneurons[i]) {
      for (let j=0; j<5; j++) {
        if (i==layers) {
          column.appendChild(CreateTarget(j));
        } else {
          column.appendChild(CreateNeuron(i,j));
        }
      }
      let hidetextdiv = document.createElement("div");
      let hidetext = document.createElement("span");
      hidetextdiv.className = "HideTextDiv";
      hidetext.className = "HideText";
      hidetext.id = "hidetext " + i;
      hidetext.innerHTML = j2 - 10;
      hidetextdiv.appendChild(hidetext);
      column.appendChild(hidetextdiv);
      for (let j=j2-5; j<j2; j++) {
        if (i==layers) {
          column.appendChild(CreateTarget(j));
        } else {
          column.appendChild(CreateNeuron(i,j));
        }
      }
    } else {
      for (let j=0; j<j2; j++) {
        if (i==layers) {
          column.appendChild(CreateTarget(j));
        } else {
          column.appendChild(CreateNeuron(i,j));
        }
      }
    }
    container.appendChild(column);
  }
  
  for (let i=0; i<layers-1; i++) {
    let j2 = structure[i+1];
    let k2 = structure[i];
    if (hideneurons[i+1]) {
      for (let j=0; j<5; j++) {
        HandleCreateWeight(i,j,k2);
      }
      for (let j=j2-5; j<j2; j++) {
        HandleCreateWeight(i,j,k2);
      }
    } else {
      for (let j=0; j<j2; j++) {
        HandleCreateWeight(i,j,k2);
      }
    }
  }
}

function HandleCreateWeight(i,j,k2) {
  if (hideneurons[i]) {
    for (let k=0; k<5; k++) {
      CreateWeight(i,j,k);
    }
    for (let k=k2-5; k<k2; k++) {
      CreateWeight(i,j,k);
    }
  } else {
    for (let k=0; k<k2; k++) {
      CreateWeight(i,j,k);
    }
  }
}

function CreateTarget(i) {
  let target = document.createElement("div");
  target.className = "Neuron";
  target.id = "target " + i;
  let targetvalue = document.createElement("span");
  targetvalue.className = "NeuronValue";
  targetvalue.id = "targetvalue " + i;
  target.appendChild(targetvalue);
  return target;
}

function CreateNeuron(i,j) {
  let neuron = document.createElement("div");
  neuron.className = "Neuron";
  neuron.id = "neuron " + i + "," + j;
  let neuronvalue = document.createElement("span");
  neuronvalue.className = "NeuronValue";
  neuronvalue.id = "neuronvalue " + i + "," + j;
  neuron.appendChild(neuronvalue);
  return neuron;
}

function CreateWeight(i,j,k) {
  let weight = document.createElement("div");
  weight.className = "Weight";
  weight.id = "weight " + (i+1) + "," + j + "," + k;
  let neuron1 = document.getElementById("neuron " + i + "," + k);
  let neuron2 = document.getElementById("neuron " + (i+1) + "," + j);
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
  document.getElementById("container").appendChild(weight);
}

