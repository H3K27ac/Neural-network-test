let training;
let traincount;
let hiddenactivation = "Sigmoid";
let outputactivation = "Sigmoid";
let gradient = 0.05;
let costcache = [0];
let activationcache = [0];
let activationcache2 = [0];

function Activation(input,i) {
  let activation;
  if (i == layers-2) {
    activation = outputactivation
  } else {
    activation = hiddenactivation
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
    activation = outputactivation
  } else {
    activation = hiddenactivation
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
  let i2 = structure[0]
  for (let i=0; i<i2; i++) {
    neurons[i] = Number(document.getElementById("input " + i).value)
  }
  FeedForward()
  UpdateColor()
}

function Testing100() {
  RandomizeInput()
  GeneralInference()
}


function FeedForward() {
  const t0 = performance.now()
  let sum;
  for (let i=0; i<layers-1; i++) {
    let j2 = structure[i+1];
    for (let j=0; j<j2; j++) {
      sum = 0
      let index = structure3[i]+structure[i]*j+1
      let k2 = structure[i];
      for (let k=0; k<k2; k++) {
        sum += weights[index+k] * neurons[structure2[i]+k]
      }
      sum += biases[structure2[i]+j+1]
      let result = Activation(sum,i)
   //   activationcache2[index2] = result
      neurons2[structure2[i+1]+j] = sum
      neurons[structure2[i+1]+j] = result
    }
  }
  const t1 = performance.now()
  document.getElementById("performance1").innerHTML = (t1-t0).toFixed(2)
}

function Testing() {
  for (let i=0; i<layers; i++) {
    let j2 = structure[i+1];
    for (let j=0; j<j2; j++) {
      let text = document.createElement("span")
      text.innerHTML = batchmean[i+1][j] + "," + batchvar[i+1][j] + "," + batchgamma[i+1][j] + "," + batchbeta[i+1][j] + "(" + (i+1) + "," + j + ")"
      document.getElementById("inputfield").appendChild(text)
    }
  }
}



function Testing2() {
  for (let i=0; i<layers; i++) {
    let j2 = structure[i];
    for (let j=0; j<j2; j++) {
      let text = document.createElement("span")
      text.innerHTML = neurons[i][j] + "," + neurons2[i][j] + "(" + i + "," + j + ")"
      document.getElementById("inputfield").appendChild(text)
    }
  }
}

function SetTarget() {
  let j2 = structure[0];
  let sum = 0;
  for (let j=0; j<j2; j++) {
    sum += neurons[j]
  }
  let target = sum / j2
  let i2 = structure[layers-1];
  for (let i=0; i<i2; i++) {
      targets[i] = target
  }
}


function NeuronCost(i,j) {
  if (i == layers-1) {
    return 2 * (neurons[structure2[i]+j] - targets[j])
  } else {
    let sum = 0;
    let k2 = structure[i+1];
    for (let k=0; k<k2; k++) {
      sum += weights[structure3[i]+structure[i]*k+j+1] * activationcache[structure2[i+1]+k] * costcache[structure2[i+1]+k] // NeuronCost(i+1,k)
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
  const t0 = performance.now()
  costcache = Array(neuroncount).fill(0);
  const t1 = performance.now()
  document.getElementById("performance2").innerHTML = (t1-t0).toFixed(2)
}

function Backprop() {
  const t0 = performance.now()
  // ResetCache()
  costcache = Array(neuroncount).fill(0);
  activationcache = Array(neuroncount).fill(0);
  RandomizeInput()
  FeedForward()
  SetTarget()
  for (let i=layers-1; i>0; i--) {
    let j2 = structure[i];
    for (let j=0; j<j2; j++) {
      let costcache2 = NeuronCost(i,j);
      let actcache2 = DerivativeActivation(neurons2[structure2[i]+j],i,neurons[structure2[i]+j]) 
      let tempcache = actcache2 * costcache2
      costcache[structure2[i]+j] = costcache2
      activationcache[structure2[i]+j] = actcache2
      biases[structure2[i]+j+1] = Math.min(biasrange, Math.max(biasrange * -1, biases[structure2[i]+j+1] - (learnrate * tempcache)))
      let k2 = structure[i-1];
      let index = structure3[i-1]+k2*j+1
      for (let k=0; k<k2; k++) {
        let weightvalue = weights[index+k]
        // (l1strength * Math.abs(weightvalue)) + (l2strength * (weightvalue ** 2))
        weights[index+k] = Math.min(weightrange, Math.max(weightrange * -1, weightvalue - (learnrate * (neurons[structure2[i-1]+k] * tempcache))))
      }
    }
  }
  const t1 = performance.now()
  document.getElementById("performance3").innerHTML = (t1-t0).toFixed(2)
  UpdateColor()
  traincount += 1
  document.getElementById("trainingcount").innerHTML = traincount
}


function ToggleTraining() {
  if (training) {
    document.getElementById("training").innerHTML = "Start training"
    clearInterval(training);
    training = undefined;
  } else {
    document.getElementById("training").innerHTML = "Stop training"
    training = setInterval(Backprop, 100);
  }
}

function Train100() {
  for (let i=0; i<100; i++) {
    Backprop()
  }
}

