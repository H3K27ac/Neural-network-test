let batching = false;
let neurons3 = [];
let neurons4 = [];


function ActivationLayer(input,i,j,m) {
  switch (layerorder[m+1]) {
    case "batchnormlayer": 
      return Activation(BatchInference(input,i,j,m+1),i)
    default:
      return Activation(input,i)
  }
}

function BatchInference(input,i,j,m) {
  batch[i+1][j][0] = input
  let result2 = batchgamma[i+1][j] * (input - batchmeanmoving[i+1][j]) / Math.sqrt(batchvarmoving[i+1][j] + epsilon) + batchbeta[i+1][j]
  switch (layerorder[m+1]) {
    case "activationlayer": 
      return ActivationLayer(result2,i,j,m+1)
    default:
      return result2
  }
}

function GeneralInference() {
  ClearNeurons()
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
}


