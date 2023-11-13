let batching = false;
let infering = false;
let batchnormindex;
let testneurons = [];
let testneurons2 = [];
let testweights = [0];
let testbiases = [0];
let testtargets = [];
let testcostcache = [0];
let testactcache = [0];

function SetTestArrays() {
  for (let i=0; i<layers; i++) {
    let prevneurons = structure[i]
    let nextneurons = structure[i+1]
    testneurons.push(nj.zeros([prevneurons]))       
    testneurons2.push(nj.zeros([prevneurons]))
    testbiases.push(nj.zeros([nextneurons]))
    testweights.push(nj.zeros([nextneurons,prevneurons]))
  }
  testtargets.push(nj.zeros([structure[layers-1]]))
}

function ResetTestCache() {
  testcostcache = [0];
  testactcache = [0];
  for (let i=0; i<layers; i++) {
    let neuronstemp = structure[i+1]
    testcostcache.push(nj.zeros([neuronstemp]))
    testactcache.push(nj.zeros([neuronstemp]))
  }
}

function TestForward() {
  for (let i=0; i<layers; i++) {
    let sum = nj.dot(testweights[i+1],testneurons[i])
    sum.add(testbiases[i+1])
    testneurons2[i+1] = sum
    testneurons[i+1] = TestActivation(sum)
  }
}

function TestActivation(input) {
  return nj.sigmoid(input)
}

function TestDerivativeActivation(input) {
  let tempresult = nj.sigmoid(input)
  return nj.multiply(tempresult,nj.subtract(1,tempresult))
}

function TestNeuronCost(i) {
  /*
  if (costcache[i][j] != undefined) {
    return costcache[i][j]
  } 
  */
  if (i == layers-1) {
    let result = nj.multiply(nj.subtract(testneurons[i],testtargets),2)
    testcostcache[i] = result
    return result
  } else {
    let sum = nj.dot(testweights[i+1],nj.multiply(testactcache[i+1],testcostcache[i+1]))
    testcostcache[i] = sum
    return sum
  }
}

function TestWeightCost(i) {
  return nj.multiply(testneurons[i-1],nj.multiply(testactcache[i],TestNeuronCost(i)))
}

function TestBiasCost(i) {
  return nj.multiply(testactcache[i],TestNeuronCost(i))
}

function TestRandomizeInput() {
  testneurons[0] = nj.random([structure[0]])
}

function TestBackprop() {
  TestRandomizeInput()
  TestForward()
  testtargets = nj.ones([structure[layers-1]])
  TestResetCache()
  for (let i=layers-2; i>-1; i--) {
    actcache[i+1] = TestDerivativeActivation(testneurons2[i+1])
    testbiases[i+1] = nj.clip(nj.subtract(testbiases[i+1],nj.multiply(TestBiasCost(i+1),learnrate)),biasrange * -1,biasrange)
    testweights[i+1] = nj.clip(nj.subtract(testweights[i+1],nj.multiply(TestWeightCost(i+1),learnrate)),weightrange * -1,weightrange)
    //  (l1strength * Math.sign(weights[i+1][j][k])) + (l2strength * (weights[i+1][j][k] ** 2))
  }
  TestUpdateColor()
  traincount += 1
  document.getElementById("trainingcount").innerHTML = traincount
}

function ActivationLayer(input,i,j,m) {
  let result2 = Activation(input,i)
//  if (infering == false) {
//  }
  switch (layerorder[m+1]) {
    case "batchnormlayer": 
      if (infering) {
        return BatchInference(result2,i,j,m+1)
      } else {
        return result2
      }
    default:
      return result2
  }
}

function BatchInference(input,i,j,m) {
//  batch[i+1][j][0] = input
  let result2 = batchgamma[i+1][j] * (input - batchmeanmoving[i+1][j]) / Math.sqrt(batchvarmoving[i+1][j] + epsilon) + batchbeta[i+1][j]
  switch (layerorder[m+1]) {
    case "activationlayer": 
      return ActivationLayer(result2,i,j,m+1)
    default:
      return result2
  }
}

function GeneralInference() {
  infering = true
  let sum;
  for (let i=0; i<layers-1; i++) {
    let j2 = structure[i+1];
    for (let j=0; j<j2; j++) {
      sum = 0
      let k2 = structure[i];
      if (batching) {
        for (let k=0; k<k2; k++) {
          sum += weights[i+1][j][k] * neurons[i][k][0]
        }
      } else {
        for (let k=0; k<k2; k++) {
          sum += weights[i+1][j][k] * neurons[i][k]
        }
      }
      sum += biases[i+1][j]
      let result;
      switch (layerorder[0]) {
        case "activationlayer":
          result = ActivationLayer(sum,i,j,0)
          break;
        case "batchnormlayer": 
          result = BatchInference(sum,i,j,0)
          break;
        default:
          result = sum
          break;
      }
      if (batching) {
        neurons[i+1][j][0] = Math.min(1, Math.max(0, result))
      } else {
        neurons[i+1][j] = Math.min(1, Math.max(0, result))
      }
    }
  }
  UpdateColor()
}


function GeneralForward() {
  infering = false
  let sum;
  for (let i=0; i<layers-1; i++) {
    let j2 = structure[i+1];
    for (let j=0; j<j2; j++) {
      sum = 0
      let k2 = structure[i];
      for (let k=0; k<k2; k++) {
        sum += weights[i+1][j][k] * neurons[i][k]
      }
      sum += biases[i+1][j]
      let result;
      switch (layerorder[0]) {
        case "activationlayer":
          result = ActivationLayer(sum,i,j,0)
          break;
        default:
          result = sum
          break;
      }
      neurons[i+1][j] = Math.min(1, Math.max(0, result))
    }
  }
}

function BatchGeneralForward() {
  infering = false
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
     //   neurons2[i+1][j][n] = sum
        let result;
        switch (layerorder[0]) {
        case "activationlayer":
          result = ActivationLayer(sum,i,j,0)
          break;
        case "batchnormlayer":
          result = sum
          break;
        default:
          result = sum
          break;
        }
        if (batchnorm) {
        batch[i+1][j][n] = result
        batchsum += result
        } else {
          neurons[i+1][j][n] = Math.min(1, Math.max(0, result))
        }
      }
      if (batchnorm) {
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
      switch (layerorder[batchnormindex+1]) {
        case "activationlayer":
          for (let n=0; n<batchsize; n++) {
            let tempnorm = (batch[i+1][j][n] - tempmean) / tempnorm2
            batchnormed[i+1][j][n] = tempnorm
            let result2 = ActivationLayer(tempgamma * tempnorm + tempbeta,i,j,batchnormindex+1)
            neurons[i+1][j][n] = Math.min(1, Math.max(0, result2))
          }
          break;
        default:
          for (let n=0; n<batchsize; n++) {
            let tempnorm = (batch[i+1][j][n] - tempmean) / tempnorm2
            batchnormed[i+1][j][n] = tempnorm
            neurons[i+1][j][n] = Math.min(1, Math.max(0, tempgamma * tempnorm + tempbeta))
          }
          break;
        }
      batchmeanmoving[i+1][j] = ((1 - batchalpha) * batchmeanmoving[i+1][j]) + (batchalpha * tempmean) 
      batchvarmoving[i+1][j] = ((1 - batchalpha) * batchvarmoving[i+1][j]) + (batchalpha * tempvar)
      }
    }
  }
}

