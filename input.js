let layertypes = ["activationlayer","batchnormlayer"];
let layernames = ["Activation layer", "Batch normalisation"];


function ReplenishLayers() {
  for (let i=0; i<layertypes.length; i++) {
    if (document.getElementById(layertypes[i] + "incontainer") == null) {
      let container = document.getElementById("layercontainer");
      let layer = document.createElement("div");
      let layertext = document.createElement("span");
      layer.className = "layerincontainer"
      layer.id = layertypes[i] + "incontainer"
      layertext.className = "layertext"
      layertext.innerHTML = layernames[i]
      layer.appendChild(layertext)
      container.appendChild(layer);
    }
  }
  UpdateContainerWidth();
}

function UpdateContainerWidth() {
  let container = document.getElementById("layercontainer");
  let children = container.children;
  let width = 0;
  for (let i=0; i<children.length; i++) {
    width += children[i].offsetWidth;
  }
  width += 10
  container.style.width = width + 'px'
}

function CreateLayers() {
  let container = document.getElementById("inputcontainer");
  let neuron = document.createElement("div")
  neuron.className = "neuron"
  neuron.id = "neuron"
  let neuron2 = document.createElement("div")
  neuron2.className = "neuron"
  neuron2.id = "neuron2"
  container.appendChild(neuron)
  container.appendChild(neuron2)
  let weight = document.createElement("div")
  weight.className = "weight"
  weight.id = "weight"
  const x1 = neuron.offsetLeft + neuron.offsetWidth / 2;
  const x2 = neuron2.offsetLeft + neuron2.offsetWidth / 2;
  const length = x2 - x1;
  const centerX = (x1 + x2) / 2;
  weight.style.width = length + "px";
  weight.style.left = centerX - (length / 2) + "px";
  container.appendChild(weight)
}
