

function Tab(id) {
  let tabs = document.getElementsByClassName("Tab") 
  let i2 = tabs.length
  for (let i = 0; i < i2; i++) {
    let tab = tabs[i]
    if (tab.id === id) {
      tab.style.display = "block"
    } else {
      tab.style.display = "none"
    }
  }
}

function AddLayer() {
  layers++
  structure.push(0)
  let currentlayer = layers
  let inputfield = document.createElement("div")
  let display = document.createElement("span")
  let increment = document.createElement("button")
  let decrement = document.createElement("button")
  let input = document.createElement("input")
  inputfield.id = "layerinput " + currentlayer
  display.innerHTML = "0"
  increment.className = "smallbutton"
  decrement.className = "smallbutton"
  increment.onclick = function() {ChangeLayer(currentlayer,1,true)}
  decrement.onclick = function() {ChangeLayer(currentlayer,-1,true)}
  input.className = "tableinput"
  input.id = "structureinput"
  inputfield.appendChild(display)
  inputfield.appendChild(increment)
  inputfield.appendChild(decrement)
  inputfield.appendChild(input)
  document.getElementById("layers").innerHTML = layers
  document.getElementById("layerinput").appendChild(inputfield)
}

function ChangeLayer(layer,value,step) {
  if (step) {
    structure[layer] += value
  } else {
    structure[layer] = value
  }
  CreateGraph()
}
