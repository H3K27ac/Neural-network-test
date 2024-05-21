var createready = false
var parametersready = false
var structureready = false

function SetInputs() {
  ChangeStructure()
  let container = document.getElementById("container")
  let lr = document.getElementById("learnrate").value
  let wr = document.getElementById("weightrange").value
  let br = document.getElementById("biasrange").value
  let complete = 0

  if (lr !== undefined && lr.trim() !== "") {
    complete++
    learnrate = Number(lr)
  }
  if (wr !== undefined && wr.trin() !== "") {
    complete++
    weightrange = wr
  }
  if (br !== undefined && br.trim() !== "") {
    complete++
    biasrange = br
  }

  let display = document.getElementById("parameterstatus")
  if (complete == 0) {
    display.innerHTML = "Missing Parameters"
    display.style.color = "Red"
  } else if (complete == 3) {
    display.innerHTML = "Parameters OK"
    display.style.color = "Green"
    parametersready = true
    if (structureready) {
      createready = true
      FillColor("Green")
    }
  } else {
    display.innerHTML = "Incomplete Parameters (" + complete + "/3)"
    display.style.color = "Yellow"
  }
  if (structureready && !createready) {
    FillColor("Red")
  }
  
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

function Toggle(id,c="Tab") {
  SetInputs()
  let tabs = document.getElementsByClassName(c) 
  let i2 = tabs.length
  for (let i = 0; i < i2; i++) {
    let tab = tabs[i]
    if (tab.id === id) {
      tab.style.display = "inline"
    } else {
      tab.style.display = "none"
    }
  }
}

function ChangeStructure() {
  let structureinput = document.getElementById("structureinput").value
  if (structureinput === undefined || structureinput.trim() === "") {
    let display = document.getElementById("structurestatus")
    display.innerHTML = "Missing Structure"
    display.style.color = "Red"
  } else {
    structure = structureinput.replace(/[{}]/g, '').split(',').map(item => parseInt(item));
    layers = structure.length
    document.getElementById("structuredisplay").innerHTML = "Structure: " + JSON.stringify(structure)
    if (layers > 1) {
      structure.push(0)
      CreateGraph()
      let display = document.getElementById("structurestatus")
      display.innerHTML = "Structure OK"
      display.style.color = "Green"
      structureready = true
    }
  }
}
