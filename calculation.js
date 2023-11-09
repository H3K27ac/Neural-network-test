let training;
let traincount;
let activation = "Sigmoid";
let gradient = 0.05;
let epsilon = 0.00001;


function Activation(input) {
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

function DerivativeActivation(input) {
  switch (activation) {
    case "Sigmoid":
      return Activation(input) * (1 - Activation(input))
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
  for (let i=0; i<structure[0]; i++) {
    neurons[0][i] = document.getElementById("input " + i).value
  }
  FeedForward()
}

function BatchForwardPass() {
  let sum;
  let batchsum;
  let batchsum2;
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      batchsum = 0;
      batchsum2 = 0;
      for (let n=0; n<batchsize; n++) {
        sum = 0;
        for (let k=0; k<structure[i]; k++) {
          sum += weights[i+1][j][k] * neurons[i][k][n]
          if (i==1 && j==0) {
        document.getElementById("training").innerHTML = sum + "," + weights[i+1][j][k] + "," + neurons[i][k][n] + "," + batchvar[1][0]
        }
        }
        sum += biases[i+1][j]
        neurons2[i+1][j][n] = sum
        batch[i+1][j][n] = Activation(sum)
        batchsum += Activation(sum)
      }
      batchmean[i+1][j] = batchsum / batchsize
      Testing3()
      for (let n=0; n<batchsize; n++) {
        batchsum2 += (batch[i+1][j][n] - batchmean[i+1][j]) ** 2
      }
      document.getElementById("layers").innerHTML = "beforevar"
      batchvar[i+1][j] = batchsum2 / batchsize
      for (let n=0; n<batchsize; n++) {
        document.getElementById("layers").innerHTML = "neurons"
        neurons[i+1][j][n] = batchgamma[i+1][j] * ((batch[i+1][j][n] - batchmean[i+1][j]) / Math.sqrt(batchvar[i+1][j] + epsilon)) + batchbeta[i+1][j]
      }
      document.getElementById("layers").innerHTML = "exp moving avg"
      // Exponential moving average
      if (batchcount == 0) {
        batchmeanmoving[i+1][j] = batchmean[i+1][j]
        batchvarmoving[i+1][j] = batchvar[i+1][j]
      } else {
        batchmeanmoving[i+1][j] = ((1 - (1/batchcount)) * batchmeanmoving[i+1][j]) + ((1 / batchcount) * batchmean[i+1][j]) 
        batchvarmoving[i+1][j] = ((1 - (1/batchcount)) * batchvarmoving[i+1][j]) + ((1 / batchcount) * batchvar[i+1][j])
      }
      batchcount += 1
    }
  }
  UpdateColor()
}

function FeedForward() {
  ClearNeurons()
  let sum;
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      sum = 0
      for (let k=0; k<structure[i]; k++) {
        sum += weights[i+1][j][k] * neurons[i][k]
      }
      sum += biases[i+1][j]
      neurons2[i+1][j] = sum
      neurons[i+1][j] = Activation(sum)
    }
  }
  UpdateColor()
}

function Testing() {
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      let text = document.createElement("span")
      text.innerHTML = batchmean[i+1][j] + "," + batchvar[i+1][j] + "," + batchgamma[i+1][j] + "," + batchbeta[i+1][j] + "(" + (i+1) + "," + j + ")"
      document.getElementById("inputfield").appendChild(text)
    }
  }
}

function Testing3() {
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i]; j++) {
      for (let n=0; n<batchsize; n++) {
        let text = document.createElement("span")
        text.innerHTML = batch[i][j][0] + "," + neurons[i][j][0] + "," + neurons2[i][j][0] + "(" + i + "," + j + "," + n ")"
        document.getElementById("inputfield").appendChild(text)
      }
    }
  }
}

function Testing2() {
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i]; j++) {
      let text = document.createElement("span")
      text.innerHTML = neurons[i][j] + "," + neurons2[i][j] + "(" + i + "," + j + ")"
      document.getElementById("inputfield").appendChild(text)
    }
  }
}

function SetTarget() {
  for (let i=0; i<structure[layers-1]; i++) {
    targets[i] = 1
  }
}
function BatchSetTarget() {
  for (let i=0; i<structure[layers-1]; i++) {
    for (let n=0; n<batchsize; n++) {
      targets[i][n] = 1
    }
  }
}

function NeuronCost(i,j) {
  if (i == layers-1) {
    return 2 * (neurons[i][j] - targets[j])
  } else {
    let sum = 0;
    for (let k=0; k<structure[i+1]; k++) {
      sum += weights[i+1][k][j] * DerivativeActivation(neurons2[i+1][k]) * NeuronCost(i+1,k)
    }
    return sum
  }
}

function WeightCost(i,j,k) {
  return neurons[i-1][k] * DerivativeActivation(neurons2[i][j]) * NeuronCost(i,j)
}

function BiasCost(i,j) {
  return DerivativeActivation(neurons2[i][j]) * NeuronCost(i,j)
}



function BatchWeightCost(i,j,k,n) {
  return neurons[i-1][k] * DerivativeActivation(neurons2[i][j][n]) * BatchNeuronCost(i,j)
}
function BatchBiasCost(i,j,n) {
  return DerivativeActivation(neurons2[i][j][n]) * BatchNeuronCost(i,j)
}
function BatchNeuronCost(i,j,n) {
  if (i == layers-1) {
    return 2 * (neurons[i][j][n] - targets[j][n])
  } else {
    let sum = 0;
    for (let k=0; k<structure[i+1]; k++) {
      document.getElementById("layers").innerHTML = "neuroncost"
      sum += weights[i+1][k][j] * DerivativeActivation(neurons2[i+1][k][n]) * BatchCost(i+1,k,n)
    }
    return sum
  }
}
function BatchNormCost(i,j,n) {
  return batchgamma[i][j] * BatchNeuronCost(i,j,n)
}
function BatchGammaCost(i,j) {
  let sum = 0;
  for (let n=0; n<batchsize; n++) {
    document.getElementById("layers").innerHTML = "gammacost"
    sum += (batch[i][j][n] - batchmean[i][j]) / Math.sqrt(batchvar[i][j] + epsilon) * BatchNeuronCost(i,j,n)
  }
  return sum
}
function BatchBetaCost(i,j) {
  let sum = 0;
  for (let n=0; n<batchsize; n++) {
    sum += BatchNeuronCost(i,j,n)
  }
  return sum
}
function BatchVarCost(i,j) {
  let sum = 0;
  for (let n=0; n<batchsize; n++) {
    document.getElementById("layers").innerHTML = "varcost"
    sum += BatchNeuronCost(i,j,n) * (batch[i][j][n] - batchmean[i][j]) * (-1 * batchgamma[i][j] / 2 * Math.pow(batchvar[i][j] + epsilon,-3/2)) // Add batch epsilon
  }
  return sum
}
function BatchMeanCost(i,j) {
  let sum = 0;
  for (let n=0; n<batchsize; n++) {
    document.getElementById("layers").innerHTML = "meancost"
    sum += BatchNeuronCost(i,j,n) * (-1 * batchgamma[i][j]) / Math.sqrt(batchvar[i][j] + epsilon) + (BatchVarCost(i,j) * (-2 * (batch[i][j][n] - batchmean[i][j])) / batchsize)
  }
  return sum
}
function BatchCost(i,j,n) {
  document.getElementById("layers").innerHTML = "batchcost"
  return BatchNormCost(i,j,n) / Math.sqrt(batchvar[i][j] + epsilon) + (BatchVarCost(i,j) * 2 * (batch[i][j][n] - batchmean[i][j]) / batchsize) + (BatchMeanCost(i,j) / batchsize)
}

function Backprop() {
  RandomizeInput()
  FeedForward()
  SetTarget()
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      biases[i+1][j] -= learnrate * BiasCost(i+1,j)
      biases[i+1][j] = Math.min(biasrange, Math.max(biasrange * -1, biases[i+1][j]))
      for (let k=0; k<structure[i]; k++) {
        // Elastic net regularisation
        let error = WeightCost(i+1,j,k) + (l1strength * Math.sign(weights[i+1][j][k])) + (l2strength * (weights[i+1][j][k] ** 2))
        weights[i+1][j][k] -= learnrate * error
        weights[i+1][j][k] = Math.min(weightrange, Math.max(weightrange * -1, weights[i+1][j][k]))
      }
    }
  }
  UpdateColor()
  traincount += 1
  document.getElementById("trainingcount").innerHTML = traincount
}

function BatchBackprop() {
  BatchRandomizeInput()
  document.getElementById("layers").innerHTML = batchnorm
  BatchForwardPass()
  Testing()
  BatchSetTarget()
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      for (let n=0; n<batchsize; n++) {
        document.getElementById("layers").innerHTML = "very broken"
        biases[i+1][j] -= learnrate * BatchBiasCost(i+1,j,n)
        biases[i+1][j] = Math.min(biasrange, Math.max(biasrange * -1, biases[i+1][j]))
        batchgamma[i+1][j] -= learnrate * BatchGammaCost(i+1,j)
        batchbeta[i+1][j] -= learnrate * BatchBetaCost(i+1,j)
        for (let k=0; k<structure[i]; k++) {
          // Elastic net regularisation
          let error = BatchWeightCost(i+1,j,k,n) + (l1strength * Math.sign(weights[i+1][j][k])) + (l2strength * (weights[i+1][j][k] ** 2))
          weights[i+1][j][k] -= learnrate * error
          weights[i+1][j][k] = Math.min(weightrange, Math.max(weightrange * -1, weights[i+1][j][k]))
        }
      }
    }
  }
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
