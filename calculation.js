
function Activation(input) {
  return 1 / (1 + (Math.E ** (-1 * input)))
}

function ForwardPass() {
  let sum;
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      sum = 0
      for (let k=0; k<structure[i]; k++) {
        sum += weights[i+1][j][k] * neurons[i][k]
      }
      sum += biases[i+1][j]
      document.getElementById("layers").innerHTML = "broken"
      neurons[i+1][j] = Activation(sum)
    }
  }
  UpdateColor()
}

function NeuronCost(i,j) {
  if (i == layers-1) {
    return 2* (targets[j] - neurons[i][j])
  }
  let sum = 0;
  for (k=0; k<structure[i+1]; k++) {
    sum += weights[i+1] 
  }
}


