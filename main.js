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
  testneurons = [];
  testneurons2 = [];
  testweights = [0];
  testbiases = [0];
  testtargets = [];
  for (let i=0; i<layers; i++) {
    let prevneurons = structure[i]
    let nextneurons = structure[i+1]
    testneurons.push(nj.zeros([prevneurons]))       
    testneurons2.push(nj.zeros([prevneurons]))
    if (nextneurons != 0) {
    testbiases.push(nj.zeros([nextneurons]))
    testweights.push(nj.zeros([nextneurons,prevneurons]))
    }
  }
  testtargets.push(nj.zeros([structure[layers-1]]))
}

function TestResetCache() {
  testcostcache = [0];
  testactcache = [0];
  for (let i=0; i<layers-1; i++) {
    let neuronstemp = structure[i+1]
    testcostcache.push(nj.zeros([neuronstemp]))
    testactcache.push(nj.zeros([neuronstemp]))
  }
  
    document.getElementById("layers").innerHTML = "reset"
}

function TestForward() {
  for (let i=0; i<layers-1; i++) {
    let sum = nj.dot(testweights[i+1],testneurons[i])
    sum.add(testbiases[i+1])
    document.getElementById("layers").innerHTML = "sum"
    testneurons2[i+1] = sum
    testneurons[i+1] = TestActivation(sum)
  }
}

function TestActivation(input) {
  return nj.sigmoid(input)
}

function TestDerivativeActivation(input,i) {
  let tempresult = nj.sigmoid(input)
  let temparray = nj.ones([structure[i]])
  document.getElementById("layers").innerHTML = "scalar"
  return nj.multiply(tempresult,nj.subtract(temparray,tempresult))
}

function TestNeuronCost(i) {
  /*
  if (costcache[i][j] != undefined) {
    return costcache[i][j]
  } 
  */
  if (i == layers-1) {
    let temparray = nj.ones([structure[i]])
    temparray.add(temparray)
    let result = nj.multiply(nj.subtract(testneurons[i],testtargets),temparray)
    testcostcache[i] = result
    return result
  } else {
    let sum = nj.dot(testweights[i+1],nj.multiply(testactcache[i+1],testcostcache[i+1]))
    testcostcache[i] = sum
    return sum
  }
}

function TestWeightCost(i) {
  /*
  document.getElementById("layers").innerHTML = "startweight"
  let tempvector = nj.multiply(testactcache[i],TestNeuronCost(i))
  let tempvector2 = testneurons[i-1]
  let tempmatrix = tempvector;
  let tempmatrix2 = tempvector2;
  document.getElementById("layers").innerHTML = "concat"
  let j2 = structure[i]
  for (let j=1; j<j2; j++) {
    tempmatrix = nj.stack([tempmatrix,tempvector])
  }
  let j3 = structure[i-1]
  for (let j=1; j<j3; j++) {
    tempmatrix2 = nj.stack([tempmatrix2,tempvector2])
  }
  document.getElementById("layers").innerHTML = "multiply"
  return nj.multiply(tempmatrix,tempmatrix2.T)
  */
  document.getElementById("layers").innerHTML = "start weight"
  let temparray = nj.multiply(testactcache[i],TestNeuronCost(i))
  let temparray2 = testneurons[i-1]
  document.getElementById("layers").innerHTML = "shape" + temparray.shape + temparray2.shape
  let j2 = temparray.shape
  let j3 = temparray2.shape
  let tempmatrix = nj.zeros([j2,j3])
  document.getElementById("layers").innerHTML = "matrix"
  for (let j=0; j<j3; j++) {
    for (let k=0; k<j3; k++) {
      tempmatrix.set(j,k,temparray.get(j) * temparray2.get(k))
    }
  }
  document.getElementById("layers").innerHTML = "weight" + JSON.stringify(tempmatrix) + i
  return tempmatrix
 // return nj.dot(nj.reshape(testneurons[i-1],[1,structure[i-1]]),nj.reshape(nj.multiply(testactcache[i],TestNeuronCost(i)),[structure[i],1]))
}

function TestBiasCost(i) {
  return nj.multiply(testactcache[i],TestNeuronCost(i))
}

function TestRandomizeInput() {
  testneurons[0] = nj.random([structure[0]])
}

function TestUpdateColor() {
  for (let i=0; i<layers; i++) {
    let j2 = structure[i]
    for (let j=0; j<j2; j++) {
      let neuronvalue;
      let gammavalue;
      let betavalue;
      if (batchnorm) {
        neuronvalue = neurons[i][j][0].toFixed(2) // To be improved
      } else {
        neuronvalue = testneurons[i].get(j).toFixed(2)
      }
      if (showneurons == "all" || i==layers-1) {
      let neuron = document.getElementById("neuron " + i + "," + j)
      neuron.style.backgroundColor = Color2(neuronvalue)
      let neuronvaluetext = document.getElementById("neuronvalue " + i + "," + j)
      neuronvaluetext.innerHTML = neuronvalue
      if (neuronvalue > 0.5) {
        neuronvaluetext.style.color = `rgb(0,0,0)`
      } else {
        neuronvaluetext.style.color = `rgb(255,255,255)`
      }
      if (batchnorm && i>0) {
        betavalue = batchbeta[i][j].toFixed(2)
        gammavalue = batchgamma[i][j].toFixed(2)
        let betatext = document.getElementById("betatext " + i + "," + j)
        let gammatext = document.getElementById("gammatext " + i + "," + j)
        betatext.style.color = Color(betavalue,"batchbeta")
        gammatext.style.color = Color(gammavalue,"batchgamma")
      } 
      }
    }
    let j3 = structure[i+1]
    for (let j=0; j<j3; j++) { 
      if (showbiases) {
      let biasvalue = testbiases[i+1].get(j).toFixed(2)
      let neuron = document.getElementById("neuron " + (i+1) + "," + j)
      neuron.style.borderColor = Color(biasvalue,"bias")
      if (batchnorm) {
        let neuroncontainer = document.getElementById("neuroncontainer " + (i+1) + "," + j)
        neuroncontainer.style.borderColor = Color(biasvalue,"bias")
      }
      }
      if (showweights) {
      for (let k=0; k<j2; k++) {
        let weightvalue = testweights[i+1].get(j,k).toFixed(2)
        let weight = document.getElementById("weight " + (i+1) + "," + j + "," + k)
        weight.style.backgroundColor = Color(weightvalue,"weight")
      }
      }
    }
  }
}

function TestBackprop() {
  document.getElementById("layers").innerHTML = "randomise"
  TestRandomizeInput()
  document.getElementById("layers").innerHTML = "forward"
  TestForward()
  testtargets = nj.ones([structure[layers-1]])
  document.getElementById("layers").innerHTML = "cache"
  TestResetCache()
  for (let i=layers-2; i>-1; i--) {
    testactcache[i+1] = TestDerivativeActivation(testneurons2[i+1],i+1)
    document.getElementById("layers").innerHTML = "biases" + JSON.stringify(testcostcache) + JSON.stringify(testactcache) + i
    testbiases[i+1] = nj.clip(nj.subtract(testbiases[i+1],nj.multiply(TestBiasCost(i+1),learnrate)),biasrange * -1,biasrange)
    document.getElementById("layers").innerHTML = "weight" + JSON.stringify(TestWeightCost(i+1))
    testweights[i+1] = nj.clip(nj.subtract(testweights[i+1],nj.multiply(TestWeightCost(i+1),learnrate)),weightrange * -1,weightrange)
    //  (l1strength * Math.sign(weights[i+1][j][k])) + (l2strength * (weights[i+1][j][k] ** 2))
  }
  document.getElementById("layers").innerHTML = "color"
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

