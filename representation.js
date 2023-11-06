let weights = [];
let neurons = [];
let biases = [];
let layers;

function DeleteGraph() {
  let graph = document.getElementById("container");
  while (graph.hasChildNodes()) {
      graph.removeChild(graph.firstChild);
  }
}

function CreateGraph() {
  let numberweight = 0
  let input = document.getElementById("structure").value
  let structure = input.replace(/[{}]/g, '').split(',').map(item => parseInt(item));
  layers = structure.length
  DeleteGraph()
  for (let i=0; i<layers; i++) {
    let subarray = [];
    let column = document.createElement("div")
    column.className = "column"
    column.id = "column " + i
    for (let j=0; j<structure[i]; j++) {
      let neuron = document.createElement("div")
      neuron.className = "neuron"
      neuron.id = "neuron " + i + "," + j
      column.appendChild(neuron)
      subarray.push(0)
    }
    document.getElementById("container").appendChild(column)
    neurons.push(subarray)
  }

  for (let i=1; i<layers; i++) {
    let subarray = [];
    for (let j=0; j<structure[i-1]; j++) {
      let subsubarray = [];
      for (let k=0; k<structure[i]; k++) {
        let weight = document.createElement("div")
        weight.className = "weight"
        weight.id = "weight " + i + "," + j + "," + k
        let neuron1 = document.getElementById("neuron " + (i-1) + "," + j)
        let neuron2 = document.getElementById("neuron " + i + "," + k)
        const x1 = neuron1.offsetLeft + neuron1.offsetWidth / 2;
        const y1 = neuron1.offsetTop + neuron1.offsetHeight / 2;
        const x2 = neuron2.offsetLeft + neuron2.offsetWidth / 2;
        const y2 = neuron2.offsetTop + neuron2.offsetHeight / 2;

        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;

        weight.style.width = length + "px";
        weight.style.transform = `rotate(${angle}rad)`;
        weight.style.left = centerX - (length / 2) + "px";
        weight.style.top = centerY - 1 + "px";
        document.getElementById("container").appendChild(weight)
        subsubarray.push(0)
        numberweight += 1
      }
      subarray.push(subsubarray)
    }
    weights.push(subarray)
  }
  
  document.getElementById("layers").innerHTML = numberweight + "," + layers
}


