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
  container.style.width = width + 'px'
}

