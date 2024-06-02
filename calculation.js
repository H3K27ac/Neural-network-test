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
var averageperformance = 0;
const numWorkers = navigator.hardwareConcurrency || 4; // Number of logical processors
const workers = [];
for (let i = 0; i < numWorkers; i++) {
  workers.push(new Worker('worker.js'));
}

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

  // Reset caches
  costcache.fill(0);
  activationcache.fill(0);

  RandomizeInput();
  FeedForward();
  SetTarget();

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

function ParallelBackprop(callback) {
  const t0 = performance.now();

  // Reset caches
  costcache.fill(0);
  activationcache.fill(0);
  
  const tasks = [];

  for (let i = 0; i < numWorkers; i++) {
    
    const workerData = {
      structure,
      structure2,
      structure3,
      neurons2,
      neurons,
      biases,
      weights,
      targets,
      costcache,
      activationcache,
      biasrange,
      weightrange,
      learnrate,
      layers
    };

    tasks.push(new Promise((resolve) => {
      workers[i].onmessage = (e) => {
        resolve(e.data);
      };
      workers[i].postMessage(workerData);
    }));
  }

  Promise.all(tasks).then((results) => {
    const weightErrors = new Float32Array(weights.length).fill(0);
    const biasErrors = new Float32Array(biases.length).fill(0);

    results.forEach((result) => {
      const { localWeightErrors, localBiasErrors } = result;

      for (let i = 0; i < weightErrors.length; i++) {
        weightErrors[i] += localWeightErrors[i];
      }

      for (let i = 0; i < biasErrors.length; i++) {
        biasErrors[i] += localBiasErrors[i];
      }
    });

    for (let i = 0; i < weights.length; i++) {
      weights[i] = Math.min(weightrange, Math.max(-weightrange, weights[i] - weightErrors[i]));
    }

    for (let i = 0; i < biases.length; i++) {
      biases[i] = Math.min(biasrange, Math.max(-biasrange, biases[i] - biasErrors[i]));
    }

    const t1 = performance.now();
    traincount++;
    averageperformance = t1 - t0;

    if (callback) callback();
  });
}


function UpdateGraph() {
  UpdateColor();
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
    training.stop();
    istraining = false;
  } else {
    trainbutton.innerHTML = "Stop Train";
    trainbutton.style.borderColor = "Red";
    trainbutton.style.color = "Red";
    document.getElementById("trainingstatus").innerHTML = "Training...";
    updategraph = setInterval(UpdateGraph, 100);
    training.start(ParallelBackprop, 0);
    istraining = true;
  }
}

function Train100() {
  for (let i=0; i<100; i++) {
    Backprop();
  }
}
