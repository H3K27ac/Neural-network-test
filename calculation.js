var training = new RecursiveTimer();
var istraining = false;
var updategraph;
var traincount = 0;
var hiddenactivation = "Sigmoid";
var outputactivation = "Sigmoid";
var gradient = 0.05;
var costcache = [0];
var activationcache = [0];
var activationcache2 = [0];
var performance = 0;

function Activation(input,i) {
  let activation;
  if (i == layers-2) {
    activation = outputactivation;
  } else {
    activation = hiddenactivation;
  }
  switch (activation) {
    case "Sigmoid":
      return 1 / (1 + Math.exp(-1 * input))
    case "ReLU": 
      return Math.max(0,input)
    case "Leaky ReLU":
      if (input > 0) {
        return input
      } else {
        return gradient * input
      }
    default:
      break;
  }
}

function DerivativeActivation(input,i,actcache) {
  let activation;
  if (i == layers-1) {
    activation = outputactivation;
  } else {
    activation = hiddenactivation;
  }
  switch (activation) {
    case "Sigmoid":
      // let result = Activation(input)
      return actcache * (1 - actcache)
    case "ReLU": 
      if (input > 0) {
        return 1
      } else {
        return 0 // Derivative is undefined at 0
      }
      case "Leaky ReLU":
      if (input > 0) {
        return 1
      } else {
        return gradient
      }
    default:
      break;
  }
}

function ManualFF() {
  let i2 = structure[0];
  for (let i=0; i<i2; i++) {
    neurons[i] = Number(document.getElementById("input " + i).value);
  }
  FeedForward();
  UpdateColor();
}

function Testing100() {
  RandomizeInput();
  GeneralInference();
}


function FeedForward() {
  let sum;
  for (let i=0; i<layers-1; i++) {
    let j2 = structure[i+1];
    for (let j=0; j<j2; j++) {
      sum = 0;
      let index = structure3[i]+structure[i]*j+1;
      let k2 = structure[i];
      for (let k=0; k<k2; k++) {
        sum += weights[index+k] * neurons[structure2[i]+k];
      }
      sum += biases[structure2[i]+j+1];
      let result = Activation(sum,i);
   //   activationcache2[index2] = result
      neurons2[structure2[i+1]+j] = sum;
      neurons[structure2[i+1]+j] = result;
    }
  }
}


function Testing() {
  for (let i=0; i<layers; i++) {
    let j2 = structure[i];
    for (let j=0; j<j2; j++) {
      let text = document.createElement("span");
      text.innerHTML = neurons[i][j] + "," + neurons2[i][j] + "(" + i + "," + j + ")";
      document.getElementById("inputfield").appendChild(text);
    }
  }
}

function SetTarget() {
  let j2 = structure[0];
  let sum = 0;
  for (let j=0; j<j2; j++) {
    sum += neurons[j];
  }
  let target = sum / j2;
  let i2 = structure[layers-1];
  for (let i=0; i<i2; i++) {
      targets[i] = target;
  }
}


function NeuronCost(i,j) {
  if (i == layers-1) {
    return 2 * (neurons[structure2[i]+j] - targets[j])
  } else {
    let sum = 0;
    let k2 = structure[i+1];
    for (let k=0; k<k2; k++) {
      sum += weights[structure3[i]+structure[i]*k+j+1] * activationcache[structure2[i+1]+k] * costcache[structure2[i+1]+k]; // NeuronCost(i+1,k)
    }
    return sum
  }
}

function WeightCost(i,j,k,actcache2) {
  return neurons[i-1][k] * actcache2 * costcache[i][j]
}

function BiasCost(i,j,actcache2) {
  return actcache2 * costcache[i][j]
}


function ResetCache() {
  costcache = Array(neuroncount).fill(0);
}

function Backprop() {
  const t0 = performance.now();
  costcache = new Float32Array(neuroncount).fill(0); // ResetCache()
  activationcache = new Float32Array(neuroncount).fill(0);
  RandomizeInput();
  FeedForward();
  SetTarget();
  let tempcache, actcache2, costcache2, weightvalue, error;
  for (let i=layers-1; i>0; i--) {
    let j2 = structure[i];
    let k2 = structure[i-1];
    for (let j=0; j<j2; j++) {
      costcache2 = NeuronCost(i,j);
      actcache2 = DerivativeActivation(neurons2[structure2[i]+j],i,neurons[structure2[i]+j]);
      tempcache = actcache2 * costcache2;
      costcache[structure2[i]+j] = costcache2;
      activationcache[structure2[i]+j] = actcache2;
      biases[structure2[i]+j+1] = Math.min(biasrange, Math.max(biasrange * -1, biases[structure2[i]+j+1] - (learnrate * tempcache)));
      let index = structure3[i-1]+k2*j+1;
      for (let k=0; k<k2; k++) {
        weightvalue = weights[index+k];
        error = neurons[structure2[i-1]+k] * tempcache; // (l1strength * Math.abs(weightvalue)) + (l2strength * (weightvalue ** 2))
        weights[index+k] = Math.min(weightrange, Math.max(weightrange * -1, weightvalue - (learnrate * error)));
      }
    }
  }
  const t1 = performance.now();
  traincount++;
  performance = t1-t0;
}

function UpdateGraph() {
  UpdateColor();
  document.getElementById("trainingcount").innerHTML = traincount;
  document.getElementById("performance").innerHTML = performance.toFixed(2) + "ms";
}


class RecursiveTimer {
  constructor() {
    this.timerId = null;
    this.isRunning = false;
  }
  start(callback, delay) {
    if (this.isRunning) return;
    this.isRunning = true;
    const tick = () => {
      if (!this.isRunning) return;
      callback();
      this.timerId = setTimeout(tick, delay);
    };
    tick();
  }
  stop() {
    if (!this.isRunning) return;
    clearTimeout(this.timerId);
    this.timerId = null;
    this.isRunning = false;
  }
}

function ToggleTraining() {
  let trainbutton = document.getElementById("training");
  if (istraining) {
    trainbutton.innerHTML = "Start Train";
    trainbutton.style.borderColor = "White";
    trainbutton.style.color = "White";
    document.getElementById("trainingstatus").innerHTML = "";
   // training.stop();
    clearInterval(updategraph);
    updategraph = undefined;
    istraining = false;
  } else {
    trainbutton.innerHTML = "Stop Train";
    trainbutton.style.borderColor = "Red";
    trainbutton.style.color = "Red";
    document.getElementById("trainingstatus").innerHTML = "Training...";
    updategraph = setInterval(UpdateGraph, 100);
  //  training.start(Backprop,1);
    istraining = true;
  }
}

function Train100() {
  for (let i=0; i<100; i++) {
    Backprop();
  }
}
