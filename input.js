

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
  let inputfield = document.createElement("div")
  let display = document.createElement("span")
  let increment = document.createElement("button")
  let decrement = document.createElement("button")
  let input = document.createElement("input")
  input.id = "structureinput"
  inputfield.appendChild(display)
  inputfield.appendChild(increment)
  inputfield.appendChild(decrement)
  inputfield.appendChild(input)
  document.getElementById("layerinput").appendChild(inputfield)
}
