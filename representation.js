let weights = [];
let neurons = [];
let biases = [];
let layers;

function CreateGraph() {
  let input = document.getElementById("structure").value
  let structure = input.replace(/[{}]/g, '').split(',').map(item => parseInt(item));
  layers = structure.length
  for (let i=0; i<layers; i++) {
    let subarray = [];
    for (let j=0; j<structure[i]; j++) {
      let neuron = document.createElement("div")
      neuron.className = "neuron"
      neuron.id = "neuron " + i + "," + j
      document.getElementById("container").appendChild(neuron)
      subarray.append(0)
    }
    array.append(subarray);
  }
  document.getElementById("layers").innerHTML = layers
}


