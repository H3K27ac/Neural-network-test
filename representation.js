let weights = [];
let neurons = [];
let biases = [];
let layers;

function CreateGraph() {
  let input = document.getElementById("structure").value
  let structure = input.replace(/[{}]/g, '').split(',').map(item => parseInt(item));
  layers = structure.length
  for (let i=0; i<layers; i++) {
  //  let subarray = [];
    let column = document.createElement("div")
    column.className = "column"
    column.id = "column " + i
    document.getElementById("layers").innerHTML = "L"
    for (let j=0; j<structure[i]; j++) {
      let neuron = document.createElement("div")
      neuron.className = "neuron"
      neuron.id = "neuron " + i + "," + j
      column.appendChild(neuron)
   //   subarray.append(0)
    }
    document.getElementById("container").appendChild(column)
   // neurons.append(subarray)
  }
  document.getElementById("layers").innerHTML = layers
}


