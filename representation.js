let weights = [0];
let neurons = [];
let neurons2 = [];
let biases = [0];
let structure = [];
let targets = [];
let layers;

// Batch normalisation variables
let batch = [];
let batchnormed = [];
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
let batchgammarange;
let batchbetarange;

// Visuals
let showneurons = "all";
let showbiases = true;
let showweights = true;

// Sub-layers in order: neurons2 (activation) batch (norm) batchnormed (shift) neurons


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
  batch = [];
  batchnormed = [];
  batchbeta = [0];
  batchgamma = [0];
  batchmean = [0];
  batchvar = [0];
  batchmeanmoving = [0];
  batchvarmoving = [0];
  batchsize = 0;
  batchcount = 0;
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
    case "batchbeta":
      valuerange = batchbetarange
      break;
    case "batchgamma":
      valuerange = batchgammarange
      break;
  }
  if (type == "batchgamma") {
    if (value == 1) return `rgb(255, 255, 255)`
    red = (Math.log(value) / Math.log(valuerange)) > 0 ? 255 : Math.round(255 * (1 + (Math.log(value) / Math.log(valuerange))));
    green = Math.round(255 * (1 - Math.abs(Math.log(value) / Math.log(valuerange))));
    blue = (Math.log(value) / Math.log(valuerange)) > 0 ? Math.round(255 * (1 - (Math.log(value) / Math.log(valuerange)))) : 255;
  } else {
    if (value == 0) return `rgb(255, 255, 255)`
    red = value > 0 ? 255 : Math.round(255 * (1 + (value / valuerange)));
    green = Math.round(255 * (1 - Math.abs(value / valuerange)));
    blue = value > 0 ? Math.round(255 * (1 - (value / valuerange))) : 255;
  }
  return `rgb(${red}, ${green}, ${blue})`;
}

function Color2(value) {
  let brightness = Math.round(255 * value);
  return `rgb(${brightness}, ${brightness}, ${brightness})`;
}

function UpdateColor() {
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i]; j++) {
      let neuronvalue;
      let gammavalue;
      let betavalue;
      if (batchnorm != "none") {
        neuronvalue = neurons[i][j][batchsize-1]
      } else {
        neuronvalue = neurons[i][j]
      }
      let neuron = document.getElementById("neuron " + i + "," + j)
      neuron.style.backgroundColor = Color2(neuronvalue)
      if (batchnorm != "none" && i>0) {
        betavalue = batchbeta[i][j]
        gammavalue = batchgamma[i][j]
        let betatext = document.getElementById("betatext " + i + "," + j)
        let gammatext = document.getElementById("gammatext " + i + "," + j)
        betatext.style.color = Color(betavalue,"batchbeta")
        gammatext.style.color = Color(gammavalue,"batchgamma")
      } 
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
      if (batchnorm != "none") {
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
  for (let j=0; j<structure[0]; j++) {
    if (batchnorm != "none") {
      for (let n=0; n<batchsize; n++) {
        neurons[0][j][n] = Math.random();
      }
    } else {
      neurons[0][j] = Math.random();
    }
  }
}



function Randomize() {
  ClearNeurons()
//  for (let j=0; j<structure[0]; j++) {
   //   neurons[0][j] = Math.random();
//  }
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      biases[i+1][j] = (Math.random() * 2 - 1) * biasrange;
      if (batchnorm != "none") {
        batchgamma[i+1][j] = Math.pow(batchgammarange,(Math.random() * 2 - 1));
        batchbeta[i+1][j] = (Math.random() * 2 - 1);
      }
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

  batchsize = document.getElementById("batchsize").value
  batchbetarange = document.getElementById("batchbetarange").value
  batchgammarange = document.getElementById("batchgammarange").value

  if (document.getElementById("batch").checked == true) {
    batchnorm = "after"
  }
  
  activation = String(document.getElementById("activation").value).trim()

  for (let i=0; i<structure[0]; i++) {
    let input = document.createElement("input")
    input.className = "input"
    input.id = "input " + i
    document.getElementById("inputfield").appendChild(input)
  }
  
  for (let i=0; i<structure[layers-1]; i++) {
    if (batchnorm !== "none") {
      let subarray = [];
      for (let n=0; n<batchsize; n++) {
        subarray.push(0)
      }
      targets.push(subarray)
    } else {
      targets.push(0)
    }
  }
  
  for (let i=0; i<layers; i++) {
    let betasubarray = [];
    let gammasubarray = [];
    let meansubarray = [];
    let varsubarray = [];
    let movingmeansubarray = [];
    let movingvarsubarray = [];
    let batchsubarray = [];
    let batchnormedsubarray = [];
    let neuronssubarray = [];
    let neurons2subarray = [];
    let batchneuronssubarray = [];
    let batchneurons2subarray = [];
    let column = document.createElement("div")
    column.className = "column"
    column.id = "column " + i
    for (let j=0; j<structure[i]; j++) {
      let batchsubsubarray = [];
      let batchnormedsubsubarray = [];
      let neuronssubsubarray = [];
      let neurons2subsubarray = [];
      let neuron = document.createElement("div")
      neuron.className = "neuron"
      neuron.id = "neuron " + i + "," + j
      if (batchnorm != "none" && i>0) {
        let neuroncontainer = document.createElement("div")
        neuroncontainer.className = "neuroncontainer"
        let betatext = document.createElement("span")
        betatext.className = "neurontext"
        betatext.id = "betatext " + i + "," + j
        betatext.innerHTML = "$$ \\beta $$"
        neuroncontainer.appendChild(betatext)
        MathJax.typeset([betatext])
        let neurontext = document.createElement("span")
        neurontext.className = "neurontext"
        neurontext.innerHTML = ","
        neuroncontainer.appendChild(neurontext)
        let gammatext = document.createElement("span")
        gammatext.className = "neurontext"
        gammatext.id = "gammatext " + i + "," + j
        gammatext.innerHTML = "$$ \\gamma $$"
        neuroncontainer.appendChild(gammatext)
        MathJax.typeset([gammatext])
        neuron.appendChild(neuroncontainer)
      }
      column.appendChild(neuron)
      if (batchnorm != "none") {
        for (let n=0; n<batchsize; n++) {
          batchsubsubarray.push(0)
          batchnormedsubsubarray.push(0)
          neuronssubsubarray.push(0)
          neurons2subsubarray.push(0)
        }
        batchsubarray.push(batchsubsubarray)
        batchnormedsubarray.push(batchnormedsubsubarray)
        batchneuronssubarray.push(neuronssubsubarray)
        batchneurons2subarray.push(neurons2subsubarray)
      } else {
        neuronssubarray.push(0)
        neurons2subarray.push(0)
      }
    }
    document.getElementById("container").appendChild(column)
    if (batchnorm != "none") {
      if (i < layers-1) {
        for (let j=0; j<structure[i+1]; j++) {
          betasubarray.push(0)
          gammasubarray.push(1)
          meansubarray.push(0)
          varsubarray.push(0)
          movingmeansubarray.push(0)
          movingvarsubarray.push(0)
        }
        batchbeta.push(betasubarray)
        batchgamma.push(gammasubarray)
        batchmean.push(meansubarray)
        batchvar.push(varsubarray)
        batchmeanmoving.push(movingmeansubarray)
        batchvarmoving.push(movingvarsubarray)
      } 
      batch.push(batchsubarray)
      batchnormed.push(batchnormedsubarray)
      neurons.push(batchneuronssubarray)
      neurons2.push(batchneurons2subarray)
    } else {
      neurons.push(neuronssubarray)
      neurons2.push(neurons2subarray)
    }
  }
  
  for (let i=0; i<layers-1; i++) {
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


