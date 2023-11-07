
function Activation(input) {
  return 1 / (1 + (Math.E ** (-1 * input)))
}

function ForwardPass() {
  for (let i=0; i<layers; i++) {
    for (let j=0; j<structure[i+1]; j++) {
      document.getElementById("layers").innerHTML = "even more broken"
      let sum = 0;
      for (let k=0; k<structure[i]; k++) {
        sum += weights[i+1][j][k] * neurons[i][k]
      }
      sum += biases[i+1]
      neurons[i+1][j] = Activation(sum)
    }
  }
  UpdateColor()
}

