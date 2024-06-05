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
var training 
//var training = new RecursiveTimer();
var istraining = false;
var lock = false;
var updategraph;
var traincount = 0;
var hiddenactivation = "Sigmoid";
var outputactivation = "Sigmoid";
var gradient = 0.05;
var costcache = [0];
var activationcache = [0];
var activationcache2 = [0];
var averageperformance = 0;
var dataset = "MNIST";
let images, labels;

const dataCache = {};

async function LoadData(name,slice,chunk) {
  if (dataCache[name]) {
    return dataCache[name];
  }
  
  const response = await fetch(name);
  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer).slice(slice);
  dataCache[name] = data;

  return data;
}

async function LoadMNIST() {
  const files = [["train-images-idx3-ubyte",16,784],["train-labels-idx1-ubyte",8,1]];
  const dataPromises = files.map(function(file) {
    return LoadData(file[0], file[1], file[2]);
  });
  
  const dataArray = await Promise.all(dataPromises);
  
  dataArray.forEach((data, index) => {
    switch (index) {
      case 0:
          images = data;
          break;
      case 1:
          labels = data;
          break;
      default:
          break;
    }
  });
}


function ManualFF() {
  let i2 = structure[0];
  for (let i=0; i<i2; i++) {
    neurons[i] = Number(document.getElementById("input " + i).value);
  }
  FeedForward();
  UpdateColor();
}


function Activation(input,i) {
  let activation;
  activation = "Sigmoid";
  if (i == layers-2) {
   // activation = outputactivation;
  } else {
   // activation = hiddenactivation;
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
  activation = "Sigmoid";
  if (i == layers-1) {
   // activation = outputactivation;
  } else {
   // activation = hiddenactivation;
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

async function SetDataset() {
  targets.fill(0);
  switch (dataset) {
    case "MNIST":
      const randomNum = Math.random();
      
      const imageIndex = Math.floor(randomNum * 60000)*784;
      const imageSubset = images.subarray(imageIndex, Math.min(imageIndex + 784, 47040000));
      const labelIndex = Math.floor(randomNum * labels.length);
      targets[labels[labelIndex]] = 1;
      imageSubset.forEach((value, index) => {
        neurons[index] = value / 255;
      })
      break;
    case "Average":
      RandomizeInput();
      SetTarget();
      break;
    default:
    break
  }
  Backprop();
}

function Backprop() {
  const t0 = performance.now();
  
  // Reset caches
  costcache.fill(0);
  activationcache.fill(0);

  FeedForward();

  let tempcache, actcache2, costcache2, weightvalue, error;

  for (let i = layers - 1; i > 0; i--) {
    const j2 = structure[i];
    const k2 = structure[i - 1];

    for (let j = 0; j < j2; j++) {
      const neuronIndex = structure2[i] + j;
      
      costcache2 = NeuronCost(i, j);
      actcache2 = DerivativeActivation(neurons2[neuronIndex], i, neurons[neuronIndex]);
      tempcache = actcache2 * costcache2;

      costcache[neuronIndex] = costcache2;
      activationcache[neuronIndex] = actcache2;

      // Update biases with clamping
      const biasIndex = neuronIndex + 1;
      biases[biasIndex] = Math.min(biasrange, Math.max(-biasrange, biases[biasIndex] - learnrate * tempcache));

      const weightStartIndex = structure3[i - 1] + k2 * j + 1;

      for (let k = 0; k < k2; k++) {
        const weightIndex = weightStartIndex + k;
        weightvalue = weights[weightIndex];
        error = neurons[structure2[i - 1] + k] * tempcache;

        // Update weights with clamping
        weights[weightIndex] = Math.min(weightrange, Math.max(-weightrange, weightvalue - learnrate * error));
      }
    }
  }

  const t1 = performance.now();
  traincount++;
  averageperformance = t1 - t0;
}

function UpdateGraph() {
  if (showcontainer) UpdateColor();
  document.getElementById("trainingcount").innerHTML = traincount;
  document.getElementById("performance").innerHTML = averageperformance.toFixed(2) + "ms";
}


function ToggleTraining() {
  let trainbutton = document.getElementById("training");
  if (istraining) {
    trainbutton.innerHTML = "Start Train";
    trainbutton.style.borderColor = "White";
    trainbutton.style.color = "White";
    document.getElementById("trainingstatus").innerHTML = "";
    clearInterval(updategraph);
    updategraph = undefined;
    clearInterval(training);
   // training.stop();
    istraining = false;
  } else {
    trainbutton.innerHTML = "Stop Train";
    trainbutton.style.borderColor = "Red";
    trainbutton.style.color = "Red";
    document.getElementById("trainingstatus").innerHTML = "Training...";
    updategraph = setInterval(UpdateGraph, 100);
    training = setInterval(SetDataset, 1);
    istraining = true;
  }
}

