
var training 
var istraining = false;
var lock = false;
var updategraph;
var traincount = 0;
var cost = "MSE"
var hiddenactivation = "Sigmoid";
var outputactivation = "Sigmoid";
var hiddenfunc;
var outputfunc;
var dxhiddenfunc;
var dxoutputfunc;
var gradient = 0.05;
var costcache = [0];
var activationcache = [0];
var activationcache2 = [0];
var averageperformance = 0;
var dataset = "Average";
let images, labels, label, predictedlabel;
let datasetready = false;
var sma = 0;
var ca = 0;
var numerator = 0;
var previousattempt = [];

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
  datasetready = true;
  let trainingstatus = document.getElementById("trainingstatus");
  trainingstatus.innerHTML = "Dataset Ready";
  trainingstatus.style.color = "White";
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
  if (i == layers-1) {
    return outputfunc(input);
  } else {
    return hiddenfunc(input);
  }
}

function ActivationSum(input,i,sum) {
  if (i == layers-1) {
    return outputfunc(input,sum);
  } else {
    return hiddenfunc(input,sum);
  }
}

function DerivativeActivation(input,i,actcache) {
  if (i == layers-1) {
    return dxoutputfunc(input,actcache);
  } else {
    return dxhiddenfunc(input,actcache);
  }
}

function DerivativeActivationSum(input,i,actcache,sum) {
  if (i == layers-1) {
    return dxoutputfunc(input,sum,actcache);
  } else {
    return dxhiddenfunc(input,sum,actcache);
  }
}

function FeedForward() {
  for (let i=0; i<layers-1; i++) {
    if ((i+1 == layers-1 && outputactivation == "Softmax") || (i+1 != layers-1 && hiddenactivation == "Softmax")) {
      FeedForwardWithSum(i);
    } else {
      FeedForward2(i);
    } 
  }
}

function FeedForward2(i) {
  let j2 = structure[i+1];
  let sum;
  for (let j=0; j<j2; j++) {
    sum = 0;
    let index = structure3[i]+structure[i]*j+1;
    let k2 = structure[i];
    for (let k=0; k<k2; k++) {
      sum += weights[index+k] * neurons[structure2[i]+k];
    }
    sum += biases[structure2b[i]+j+1];
    let result = Math.min(neuronrange,Math.max(0,Activation(sum,i+1)));
    neurons2[structure2b[i]+j] = sum;
    neurons[structure2[i+1]+j] = result;
  }
}

function FeedForwardWithSum(i) {
  let j2 = structure[i+1];
  let sum2 = 0;
  let sum;
  for (let j=0; j<j2; j++) {
    sum = 0;
    let index = structure3[i]+structure[i]*j+1;
    let k2 = structure[i];
    for (let k=0; k<k2; k++) {
      sum += weights[index+k] * neurons[structure2[i]+k];
    }
    sum += biases[structure2b[i]+j+1];
    neurons2[structure2b[i]+j] = sum;
    sum2 += Math.exp(sum);
  }
  for (let j=0; j<j2; j++) {
    let result = Math.min(neuronrange,Math.max(0,ActivationSum(neurons2[structure2b[i]+j],i+1,sum2)));
    neurons[structure2[i+1]+j] = result;
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
    return 2 * (neurons[structure2[i]+j] - targets[j]);
  } else {
    let sum = 0;
    let k2 = structure[i+1];
    for (let k=0; k<k2; k++) {
      sum += weights[structure3[i]+structure[i]*k+j+1] * activationcache[structure2b[i]+k] * costcache[structure2b[i]+k]; // NeuronCost(i+1,k)
    }
    return sum
  }
}


async function SetDataset() {
  targets.fill(0);
  switch (dataset) {
    case "MNIST":
      const randomNum = Math.random();
      
      const imageIndex = Math.floor(randomNum * 60000)*784;
      const imageSubset = images.subarray(imageIndex, Math.min(imageIndex + 784, 47040000));
      const labelIndex = Math.floor(randomNum * labels.length);
      label = labels[labelIndex];
      targets[label] = 1;
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
      const neuronIndex2 = structure2b[i-1] + j;
      
      
      costcache2 = NeuronCost(i, j);
      actcache2 = DerivativeActivation(neurons2[neuronIndex2], i, neurons[neuronIndex]);
      tempcache = actcache2 * costcache2;
      
      costcache[neuronIndex2] = costcache2;
      activationcache[neuronIndex2] = actcache2;

      // Update biases with clamping
      biases[neuronIndex2 + 1] = Math.min(biasrange, Math.max(-biasrange, biases[neuronIndex2 + 1] - learnrate * tempcache));

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

function PredictedLabel() {
  let max = 0;
  let maxValue = 0;
  const i2 = structure2[layers]
  for (let i = structure2[layers-1]; i < i2; i++) {
    if (neurons[i] > maxValue) {
      max = i;
      maxValue = neurons[i];
    }
  }
  if (maxValue == 0) {
    predictedlabel = 0;
  } else {
    predictedlabel = max - structure2[layers-1];
  }
}

function UpdateGraph(updatelabel=true) {
  if (showcontainer) UpdateColor();
  if (dataset == "MNIST" && showimage) {
    UpdatePixels();
    PredictedLabel();
    document.getElementById("predictedtext").innerHTML = predictedlabel;
    const correctlabel = document.getElementById("correctlabel");
    if (updatelabel) {
      document.getElementById("labeltext").innerHTML = label;
      let currentattempt = 0;
      if (label == predictedlabel) {
        correctlabel.innerHTML = "Correct";
        correctlabel.style.color = "Lime";
        previousattempt.push(1);
        currentattempt = 1;
      } else {
        correctlabel.innerHTML = "Incorrect";
        correctlabel.style.color = "Red";
        previousattempt.push(0);
      }
      if (previousattempt.length > 51) {
        previousattempt.shift();
      };
      let length = previousattempt.length-1;
      let sum = 0;
      for (let i = 0; i < length; i++) {
        sum += previousattempt[i];
      }
      sma = (sum + currentattempt) / (length+1);
      document.getElementById("smatext").innerHTML = (100*sma).toFixed(2) + "%";
    } else {
      correctlabel.innerHTML = "-";
      correctlabel.style.color = "White";
      document.getElementById("smatext").innerHTML = "-";
      document.getElementById("labeltext").innerHTML = "-";
    }
  }
  if (dataset == "MNIST") {
    document.getElementById("trainingcount").innerHTML = traincount + " (" + (traincount/60000).toFixed(2) + " Epochs)";
  } else {
    document.getElementById("trainingcount").innerHTML = traincount;
  }
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
    if (datasetready || dataset != "MNIST") {
      trainbutton.innerHTML = "Stop Train";
      trainbutton.style.borderColor = "Red";
      trainbutton.style.color = "Red";
      document.getElementById("trainingstatus").innerHTML = "Training on " + dataset ;
      updategraph = setInterval(UpdateGraph, 100);
      training = setInterval(SetDataset, 1);
      istraining = true;
    } else {
      Warn("training","Start Train","Dataset NR");
    }
  }
}

