let training;
let traincount;
let hiddenactivation = "Sigmoid";
let outputactivation = "Sigmoid";
let gradient = 0.05;
let epsilon = 0.00001;
let costcache = [0];
let activationcache = [0];
let varcache = [0];
let batchalpha = 0.99;

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

function DerivativeActivation(input,i) {
  let activation;
  if (i == layers-1) {
    activation = outputactivation
  } else {
    activation = hiddenactivation
  }
  switch (activation) {
    case "Sigmoid":
      let result = Activation(input)
      return result * (1 - result)
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
    if (batchnorm) {
      neurons[0][i][0] = Number(document.getElementById("input " + i).value)
    } else {
      neurons[0][i] = Number(document.getElementById("input " + i).value)
    }
  }
  GeneralInference()
}

function Testing100() {
  RandomizeInput()
  GeneralInference()
}

function BatchForwardPass() {
  let sum;
  let batchsum;
  let batchsum2;
  for (let i=0; i<layers; i++) {
    let j2 = structure[i+1];
    for (let j=0; j<j2; j++) {
      batchsum = 0;
      batchsum2 = 0;
      for (let n=0; n<batchsize; n++) {
        sum = 0;
        let k2 = structure[i];
        for (let k=0; k<k2; k++) {
          sum += weights[i+1][j][k] * neurons[i][k][n]
        }
        sum += biases[i+1][j]
        neurons2[i+1][j][n] = sum
        let result = Activation(sum,i)
        batch[i+1][j][n] = result
        batchsum += result
      }
      let tempmean = batchsum / batchsize
      batchmean[i+1][j] = tempmean
      for (let n=0; n<batchsize; n++) {
        batchsum2 += (batch[i+1][j][n] - tempmean) ** 2
      }
      let tempvar = batchsum2 / batchsize
      batchvar[i+1][j] = tempvar
      let tempgamma = batchgamma[i+1][j]
      let tempbeta = batchbeta[i+1][j]
      let tempnorm2 = Math.sqrt(tempvar + epsilon)
      for (let n=0; n<batchsize; n++) {
        let tempnorm = (batch[i+1][j][n] - tempmean) / tempnorm2
        batchnormed[i+1][j][n] = tempnorm
        neurons[i+1][j][n] = Math.min(1, Math.max(0, tempgamma * tempnorm + tempbeta))
      }
      // Exponential moving average
      batchmeanmoving[i+1][j] = ((1 - batchalpha) * batchmeanmoving[i+1][j]) + (batchalpha * tempmean) 
      batchvarmoving[i+1][j] = ((1 - batchalpha) * batchvarmoving[i+1][j]) + (batchalpha * tempvar)
    }
  }
}

// FOR DEBUG
//let text6 = document.createElement("span")
//      text6.innerHTML = "After exp:  " +  JSON.stringify(batchnormed) + ",    " + JSON.stringify(batchmean) + ",    " + JSON.stringify(batchvar) + ",    " + JSON.stringify(batchmeanmoving) +  ",    " + JSON.stringify(batchvarmoving) + "," + batchcount
//      document.getElementById("inputfield").appendChild(text6)

function FeedForward() {
  const t0 = performance.now()
  let sum;
  for (let i=0; i<layers-1; i++) {
    let j2 = structure[i+1];
    for (let j=0; j<j2; j++) {
      sum = 0
      let k2 = structure[i];
      if (batchnorm) {
        for (let k=0; k<k2; k++) {
          sum += weights[i+1][j][k] * neurons[i][k][0]
        }
      } else {
        for (let k=0; k<k2; k++) {
          sum += weights[i+1][j][k] * neurons[i][k]
        }
      }
      sum += biases[i+1][j]
      let result = Activation(sum,i)
      if (batchnorm) {
        batch[i+1][j][0] = result
        let result2 = batchgamma[i+1][j] * (result - batchmeanmoving[i+1][j]) / Math.sqrt(batchvarmoving[i+1][j] + epsilon) + batchbeta[i+1][j]
        neurons[i+1][j][0] = Math.min(1, Math.max(0, result2))
      } else {
        neurons2[i+1][j] = sum
        neurons[i+1][j] = result
      }
    }
  }
  const t1 = performance.now()
  document.getElementById("performance1").innerHTML = (t1-t0) 
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
  let i2 = structure[layers-1];
  for (let i=0; i<i2; i++) {
    if (batchnorm) {
      for (let n=0; n<batchsize; n++) {
        targets[i][n] = 1
      }
    } else {
      targets[i] = 1
    }
  }
}


function NeuronCost(i,j) {
  /*
  if (costcache[i][j] != undefined) {
    return costcache[i][j]
  } 
  */
  if (i == layers-1) {
    return 2 * (neurons[i][j] - targets[j])
  } else {
    let sum = 0;
    let k2 = structure[i+1];
    for (let k=0; k<k2; k++) {
      sum += weights[i+1][k][j] * activationcache[i+1][k] * costcache[i+1][k] // NeuronCost(i+1,k)
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


function BatchWeightCost(i,j,k,n,actcache2) {
  return neurons[i-1][k][n] * actcache2 * costcache[i][j][n]
}
function BatchBiasCost(i,j,n,actcache2) {
  return actcache2 * costcache[i][j][n]
}
function BatchNeuronCost(i,j,n) {
  if (i == layers-1) {
    let result = 2 * (neurons[i][j][n] - targets[j][n])
    return result
  } else {
    let sum = 0;
    let k2 = structure[i+1];
    for (let k=0; k<k2; k++) {
      sum += weights[i+1][k][j] * activationcache[i+1][k][n] * BatchCost(i+1,k,n) 
    }
    return sum
  }
}
function BatchNormCost(i,j,n) {
  return batchgamma[i][j] * costcache[i][j][n]
}
function BatchGammaCost(i,j) {
  let sum = 0;
  for (let n=0; n<batchsize; n++) {
    sum += batchnormed[i][j][n] * BatchNeuronCost(i,j,n)
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
  let tempsum = (-1 * batchgamma[i][j] / 2 * Math.pow(batchvar[i][j] + epsilon,-3/2)) 
  let tempmean = batchmean[i][j]
  for (let n=0; n<batchsize; n++) {
    sum += costcache[i][j][n] * (batch[i][j][n] - tempmean) * tempsum
  }
  return sum
}
function BatchMeanCost(i,j) {
  let sum = 0;
  let tempsum = (-1 * batchgamma[i][j]) / Math.sqrt(batchvar[i][j] + epsilon)
  for (let n=0; n<batchsize; n++) {
    sum += costcache[i][j][n] * tempsum + (varcache[i][j] * (-2 * (batch[i][j][n] - batchmean[i][j])) / batchsize)
  }
  return sum
}
function BatchCost(i,j,n) {
  return BatchNormCost(i,j,n) / Math.sqrt(batchvar[i][j] + epsilon) + (varcache[i][j] * 2 * (batch[i][j][n] - batchmean[i][j]) / batchsize) + (BatchMeanCost(i,j) / batchsize)
}

function ResetCache() {
  const t0 = performance.now()
  costcache = [0];
  activationcache = [0];
  for (let i=0; i<layers-1; i++) {
    let subarray = [];
    let subarray2 = [];
    let subarray3 = [];
    let j2 = structure[i+1]
    for (let j=0; j<j2; j++) {
      if (batchnorm) {
        let subsubarray = [];
        let subsubarray2 = [];
        for (let n=0; n<batchsize; n++) {
          subsubarray.push(0)
          subsubarray2.push(0)
        }
        subarray.push(subsubarray)
        subarray2.push(subsubarray2)
        subarray3.push(0)
      } else {
        subarray.push(0)
        subarray2.push(0)
      }
    }
    costcache.push(subarray)
    activationcache.push(subarray2)
    if (batchnorm) {
      varcache.push(subarray3)
    }
  }
  const t1 = performance.now()
  document.getElementById("performance2").innerHTML = (t1-t0) 
}

function Backprop() {
  RandomizeInput()
  FeedForward()
  SetTarget()
  ResetCache()
  const t0 = performance.now()
  for (let i=layers-1; i>0; i--) {
    let j2 = structure[i];
    for (let j=0; j<j2; j++) {
      let costcache2 = NeuronCost(i,j)
      let actcache2 = DerivativeActivation(neurons2[i][j],i)
      let tempcache = actcache2 * costcache2
      activationcache[i][j] = actcache2
      costcache[i][j] = costcache2
      biases[i][j] = Math.min(biasrange, Math.max(biasrange * -1, biases[i][j] - (learnrate * tempcache)))
      let k2 = structure[i-1];
      for (let k=0; k<k2; k++) {
        let weightvalue = weights[i][j][k]
        // Elastic net regularisation
        let error = neurons[i-1][k] * tempcache + (l1strength * Math.abs(weightvalue)) + (l2strength * (weightvalue ** 2))
        weights[i][j][k] = Math.min(weightrange, Math.max(weightrange * -1, weightvalue - (learnrate * error)))
      }
    }
  }
  const t1 = performance.now()
  document.getElementById("performance3").innerHTML = (t1-t0) 
  UpdateColor()
  traincount += 1
  document.getElementById("trainingcount").innerHTML = traincount
}

function BatchBackprop() {
  RandomizeInput()
  BatchForwardPass()
  SetTarget()
  ResetCache()
  for (let i=layers-2; i>-1; i--) {
    let j2 = structure[i+1];
    for (let j=0; j<j2; j++) {
      for (let n=0; n<batchsize; n++) {
        costcache[i+1][j][n] = BatchNeuronCost(i+1,j,n)
        let actcache2 = DerivativeActivation(neurons2[i+1][j][n],i+1)
        activationcache[i+1][j][n] = actcache2
        biases[i+1][j] = Math.min(biasrange, Math.max(biasrange * -1, biases[i+1][j] - (learnrate * BatchBiasCost(i+1,j,n,actcache2))))
        let k2 = structure[i];
        for (let k=0; k<k2; k++) {
          // Elastic net regularisation
          let error = BatchWeightCost(i+1,j,k,n,actcache2) + (l1strength * Math.sign(weights[i+1][j][k])) + (l2strength * (weights[i+1][j][k] ** 2))
          weights[i+1][j][k] = Math.min(weightrange, Math.max(weightrange * -1, weights[i+1][j][k] - (learnrate * error)))
        }
      }
      let varcache2 = BatchVarCost(i+1,j)
      varcache[i+1][j] = varcache2
      batchgamma[i+1][j] = Math.min(batchgammarange, Math.max(1/batchgammarange, batchgamma[i+1][j] - (learnrate * BatchGammaCost(i+1,j))))
      batchbeta[i+1][j] = Math.min(batchbetarange, Math.max(batchbetarange * -1, batchbeta[i+1][j] - (learnrate * BatchBetaCost(i+1,j))))
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
    if (batchnorm) {
      training = setInterval(BatchBackprop, 200);
    } else {
      training = setInterval(Backprop, 100);
    }
  }
}

function Train100() {
  for (let i=0; i<100; i++) {
    Backprop()
  }
}
