let batching = false;
let infering = false;
let batchnormindex;
let neurons3 = [];
let neurons4 = [];


function ActivationLayer(input,i,j,m) {
  document.getElementById("layers").innerHTML = "activation"
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
  document.getElementById("layers").innerHTML = "start"
  infering = true
  let sum;
  for (let i=0; i<layers-1; i++) {
    let j2 = structure[i+1];
    for (let j=0; j<j2; j++) {
      sum = 0
      let k2 = structure[i];
      document.getElementById("layers").innerHTML = "batching"
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
      document.getElementById("layers").innerHTML = "switch"
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

