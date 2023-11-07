
function Activation(input) {
  return 1 / (1 + (Math.e ** (-1 * input)))
}

function CalculateNeuron(i,j) {
  let sum = 0;
  for (let k=0; i<structure[i-1]; k++) {
    sum += weights[i][j][k] * neurons[i-1][k]
  }
  document.getElementById("layers").innerHTML = "broken"
  sum += biases[i]
  return Activation(sum)
}

function ForwardPass() {
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      document.getElementById("layers").innerHTML = "even more broken"
      neurons[i+1][j] = CalculateNeuron(i+1,j)
    }
  }
  UpdateColor()
}

