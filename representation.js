let weights = [];
let neurons = [];
let biases = [];
let layers;

function CreateGraph() {
  let input = document.getElementById("structure").value
  let array = input.replace(/[{}]/g, '').split(',');
  layers = array.length
  document.getElementById("layers").innerHTML = array
}


