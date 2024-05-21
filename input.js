
function SetInputs() {
  let container = document.getElementById("container")
  
  learnrate = Number(document.getElementById("learnrate").value)
  weightrange = document.getElementById("weightrange").value
  biasrange = document.getElementById("biasrange").value
//  l1strength = document.getElementById("L1strength").value
//  l2strength = document.getElementById("L2strength").value
 
  
  for (let i=0; i<layers; i++) {
    neuroncount += structure[i]
    structure2.push(neuroncount)
    if (i>0) { 
      weightcount += structure[i] * structure[i-1]
      structure3.push(weightcount)
    }
  }

  if (neuroncount < 100) {
    showweights = true
    showbiases = true
    showneurons = "all"
  } else {
    showweights = false
    showbiases = false
    showneurons = "output"
  }

  neurons = new Float32Array(neuroncount).fill(0)
  neurons2 = new Float32Array(neuroncount+1).fill(0)
  weights = new Float32Array(weightcount+1).fill(0)
  biases = new Float32Array(neuroncount+1).fill(0)
  targets = new Float32Array(structure[layers-1]).fill(0)
  
  document.getElementById("neuroncount").innerHTML = "Neurons: " + neuroncount
  document.getElementById("weightcount").innerHTML = "Weights: " + weightcount
  document.getElementById("layercount").innerHTML = "Layers: " + layers
}

function Toggle(id,c="Tab",invert=0) {
  SetInputs()
  let tabs = document.getElementsByClassName(c) 
  let i2 = tabs.length
  for (let i = 0; i < i2; i++) {
    let tab = tabs[i]
    if (tab.id === id) {
      if (invert==0) {
        tab.style.display = "inline"
      } else {tab.style.display = "none"}
    } else {
      if (invert==0) {
        tab.style.display = "none"
      } else {tab.style.display = "inline"}
    }
  }
}

function ChangeStructure() {
  let structureinput = document.getElementById("structureinput").value
  structure = structureinput.replace(/[{}]/g, '').split(',').map(item => parseInt(item));
  layers = structure.length
  document.getElementById("structuredisplay").innerHTML = "Structure: " + JSON.stringify(structure)
  if (layers > 1) {
    structure.push(0)
    CreateGraph()
  }
}
