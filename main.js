let batching = false;
let neurons3 = [];
let neurons4 = [];


function func1(input) {
  return input
}
function func2(input) {
  return func1(input)
}
function func3(input) {
  return func2(input)
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
          sum += weights[i+1][j][k] * neurons[i][k]
        }
      } else {
        for (let k=0; k<k2; k++) {
          sum += weights[i+1][j][k] * neurons[i][k][0]
        }
      }
      sum += biases[i+1][j]
      let result = func3(sum)
      if (batchnorm != "none") {
        batch[i+1][j][0] = result
        let result2 = batchgamma[i+1][j] * (result - batchmeanmoving[i+1][j]) / Math.sqrt(batchvarmoving[i+1][j] + epsilon) + batchbeta[i+1][j]
        neurons[i+1][j][0] = Math.min(1, Math.max(0, result2))
      } else {
        neurons2[i+1][j] = sum
        neurons[i+1][j] = result
      }
    }
  }
}
