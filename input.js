

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
